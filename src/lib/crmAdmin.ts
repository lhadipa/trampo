export type CrmTimelineRow = {
  id?: string;
  created_at?: string | null;
  updated_at?: string | null;
  status?: string | null;
  [key: string]: unknown;
};

export type CrmTimelineEvent = {
  id: string;
  source: string;
  occurredAt: string;
  status?: string;
};

export type CrmClientFilter = {
  query?: string;
  type?: string;
  status?: "all" | "active" | "blocked";
  from?: string;
  to?: string;
};

export const crmListQueryContract = {
  select: "*",
  orderColumn: "created_at",
  ascending: false,
  limit: 500,
} as const;

export const canToggleAccount = (
  adminId: string | null | undefined,
  targetId: string,
) => Boolean(adminId && adminId !== targetId);

export const filterCrmClients = <T extends Record<string, any>>(
  clients: T[],
  filter: CrmClientFilter,
) => {
  const query = (filter.query || "").trim().toLowerCase();
  return clients
    .filter((client) => {
      const haystack = [
        client.id,
        client.name,
        client.email,
        client.cpf,
        client.cnpj,
      ]
        .join(" ")
        .toLowerCase();
      const createdAt = client.created_at ? Date.parse(client.created_at) : NaN;
      const from = filter.from
        ? Date.parse(filter.from)
        : Number.NEGATIVE_INFINITY;
      const to = filter.to
        ? Date.parse(filter.to) + 86400000
        : Number.POSITIVE_INFINITY;
      const typeOk =
        !filter.type || filter.type === "all" || client.crmType === filter.type;
      const statusOk =
        !filter.status ||
        filter.status === "all" ||
        (filter.status === "blocked" ? client.blocked : !client.blocked);
      return (
        (!query || haystack.includes(query)) &&
        typeOk &&
        statusOk &&
        createdAt >= from &&
        createdAt < to
      );
    })
    .sort(
      (left, right) =>
        (Date.parse(right.created_at || "") || 0) -
        (Date.parse(left.created_at || "") || 0),
    );
};

export const consolidateCrmRelations = (
  relations: Record<string, CrmTimelineRow[] | undefined>,
  scope: {
    userId: string;
    companyIds?: string[];
    freelancerIds?: string[];
    jobs?: CrmTimelineRow[];
  },
) => {
  const companyIds = new Set(scope.companyIds || []);
  const freelancerIds = new Set(scope.freelancerIds || []);
  const jobs = scope.jobs || [];
  const jobBelongs = (jobId: unknown) =>
    jobs.some(
      (job) => job.id === jobId && companyIds.has(String(job.company_id)),
    );
  const belongs = (table: string, row: CrmTimelineRow) => {
    if (table === "users") return row.id === scope.userId;
    if (table === "companies") return companyIds.has(String(row.id));
    if (table === "individual_contractors") return row.user_id === scope.userId;
    if (table === "freelancers") return freelancerIds.has(String(row.id));
    if (table === "jobs") return companyIds.has(String(row.company_id));
    if (table === "applications")
      return (
        freelancerIds.has(String(row.freelancer_id)) || jobBelongs(row.job_id)
      );
    if (table === "conversations")
      return (
        row.company_user_id === scope.userId ||
        row.freelancer_user_id === scope.userId
      );
    if (table === "messages")
      return row.user_id === scope.userId || row.from_user === scope.userId;
    if (table === "reviews")
      return row.from_user === scope.userId || row.to_user === scope.userId;
    return (
      row.user_id === scope.userId ||
      row.company_user_id === scope.userId ||
      row.freelancer_user_id === scope.userId ||
      companyIds.has(String(row.company_id)) ||
      freelancerIds.has(String(row.freelancer_id)) ||
      jobBelongs(row.job_id)
    );
  };
  return Object.fromEntries(
    Object.entries(relations).map(([table, rows]) => [
      table,
      (rows || []).filter((row) => belongs(table, row)),
    ]),
  );
};

export const deriveCrmClientIndicators = (
  relations: Record<string, CrmTimelineRow[] | undefined>,
) => {
  const count = (name: string) => relations[name]?.length || 0;
  const payments = relations.payments || [];
  const amount = payments.reduce(
    (total, row) => total + Number(row.amount || 0),
    0,
  );
  return {
    operationalRecords: [
      "jobs",
      "applications",
      "contracts",
      "conversations",
      "messages",
      "reviews",
      "checkins",
    ].reduce((total, name) => total + count(name), 0),
    contracts: count("contracts"),
    payments: count("payments"),
    paymentVolume: amount,
    lastActivityAt: normalizeCrmTimeline(relations)[0]?.occurredAt,
  };
};

const validDate = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(Date.parse(value));

export const normalizeCrmTimeline = (
  relations: Record<string, CrmTimelineRow[] | undefined>,
): CrmTimelineEvent[] =>
  Object.entries(relations)
    .flatMap(([source, rows]) =>
      (rows || []).flatMap((row, index) => {
        const occurredAt = validDate(row.created_at)
          ? row.created_at
          : validDate(row.updated_at)
            ? row.updated_at
            : null;
        if (!occurredAt) return [];
        return [
          {
            id: `${source}:${row.id || index}`,
            source,
            occurredAt,
            ...(row.status ? { status: row.status } : {}),
          },
        ];
      }),
    )
    .sort(
      (left, right) =>
        Date.parse(right.occurredAt) - Date.parse(left.occurredAt),
    );
