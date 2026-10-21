import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export const renderPilot = (ui: ReactElement, route = "/") =>
  render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
