import React from "react";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { mockFetchPatientMedicationsResponse } from "../../../__mocks__/medication.mock";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-api";
import { of } from "rxjs/internal/observable/of";
import { fetchPatientMedications } from "./medications.resource";
import MedicationsDetailedSummary from "./medications-detailed-summary.component";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockFetchPatientMedications = fetchPatientMedications as jest.Mock;

jest.mock("./medications.resource", () => ({
  fetchPatientMedications: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

let wrapper;

describe("<MedicationsDetailedSummary/>", () => {
  afterEach(cleanup);

  beforeEach(mockFetchPatientMedications.mockReset);
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("should render without dying", async () => {
    mockFetchPatientMedications.mockReturnValue(
      of(mockFetchPatientMedicationsResponse)
    );

    wrapper = render(
      <BrowserRouter>
        <MedicationsDetailedSummary />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("should display the patient's medications correctly", async () => {
    mockFetchPatientMedications.mockReturnValue(
      of(mockFetchPatientMedicationsResponse)
    );

    const { getByText, getAllByText, container, debug } = render(
      <BrowserRouter>
        <MedicationsDetailedSummary />
      </BrowserRouter>
    );

    await wait(() => {
      expect(container).toBeDefined();
      // Current medications
      expect(getByText("Medications - current").textContent).toBeTruthy();
      expect(getAllByText("Add").length).toEqual(2);
      expect(getByText("Medications - past").textContent).toBeTruthy();
      expect(wrapper.getAllByText("NAME")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("STATUS")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("START DATE")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("ACTIONS")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("sulfadoxine")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText(/oral/)[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText(/capsule/)[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("DOSE")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("500 mg")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText(/Twice daily/)[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText(/3 Days/)[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("REFILLS")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("NEW")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("12-Feb-2020")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("Revise")[0].textContent).toBeTruthy();
      expect(wrapper.getAllByText("Discontinue")[0].textContent).toBeTruthy();
    });
  }, 6000);

  it("should not display the patient's medications when they are absent", async () => {
    mockFetchPatientMedications.mockReturnValue(of([]));

    wrapper = render(
      <BrowserRouter>
        <MedicationsDetailedSummary />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Medications").textContent).toBeTruthy();
      expect(
        wrapper.getByText(
          "This patient has no medication orders in the system."
        ).textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText("Add medication order").textContent
      ).toBeTruthy();
    });
  });
});
