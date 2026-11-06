import AsyncStorage from "@react-native-async-storage/async-storage";

export type MobileRewardState = { points: number; level: number; nextLevelAt: number; earnedBadgeIds: string[]; events: string[] };
const KEY = "trampo_mobile_pilot_progress";
const initial: MobileRewardState = { points: 0, level: 1, nextLevelAt: 100, earnedBadgeIds: [], events: [] };

export const readPilotProgress = async () => {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? ({ ...initial, ...JSON.parse(raw) } as MobileRewardState) : initial;
};

export const recordPilotProgress = async (eventKey: string, points: number, badgeId?: string) => {
  const current = await readPilotProgress();
  if (current.events.includes(eventKey)) return current;
  const nextPoints = current.points + points;
  const next = { ...current, points: nextPoints, level: Math.floor(nextPoints / 100) + 1, nextLevelAt: (Math.floor(nextPoints / 100) + 1) * 100, events: [...current.events, eventKey], earnedBadgeIds: badgeId && !current.earnedBadgeIds.includes(badgeId) ? [...current.earnedBadgeIds, badgeId] : current.earnedBadgeIds };
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
};
