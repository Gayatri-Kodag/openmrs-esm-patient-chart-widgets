import React from "react";
import { Link } from "react-router-dom";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { getDimensions } from "./heightandweight.resource";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import styles from "./heightandweight-overview.css";
import VitalsForm from "../vitals/vitals-form.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import { openWorkspaceTab } from "../shared-utils";
import useChartBasePath from "../../utils/use-chart-base";

export default function HeightAndWeightOverview(
  props: HeightAndWeightOverviewProps
) {
  const [dimensions, setDimensions] = React.useState([]);
  const [showMore, setShowMore] = React.useState(false);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const chartBasePath = useChartBasePath();
  const heightweightPath = chartBasePath + "/" + props.basePath;

  React.useEffect(() => {
    if (patientUuid) {
      const sub = getDimensions(patientUuid).subscribe(dimensions => {
        setDimensions(dimensions);
      });

      return () => sub.unsubscribe();
    }
  }, [patientUuid]);

  return (
    <>
      {dimensions.length > 0 ? (
        <SummaryCard
          name="Height & Weight"
          link={`${heightweightPath}`}
          showComponent={() => openWorkspaceTab(VitalsForm, "Vitals Form")}
          addComponent={VitalsForm}
        >
          <SummaryCardRow>
            <SummaryCardRowContent>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableRow}>
                    <th
                      className={`${styles.tableHeader} ${styles.tableDates}`}
                      style={{ textAlign: "start" }}
                    ></th>
                    <th className={styles.tableHeader}>Weight</th>
                    <th className={styles.tableHeader}>Height</th>
                    <th className={styles.tableHeader}>BMI</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dimensions
                    .slice(0, showMore ? 6 : 3)
                    .map((dimension, index) => (
                      <tr key={dimension.id} className={styles.tableRow}>
                        <td
                          className={styles.tableData}
                          style={{ textAlign: "start" }}
                        >
                          {dimension.date}
                        </td>
                        <td className={styles.tableData}>
                          {dimension.weight || "\u2014"}
                          <span className={styles.unit}>
                            {index === 0 && " kg"}
                          </span>
                        </td>
                        <td className={styles.tableData}>
                          {dimension.height || "\u2014"}
                          <span className={styles.unit}>
                            {index === 0 && " cm"}
                          </span>
                        </td>
                        <td className={styles.tableData}>
                          {dimension.bmi || "\u2014"}
                          {}
                          <span className={styles.unit}>
                            {index === 0 && " kg/m"}
                            {index === 0 && <sup>2</sup>}
                          </span>
                        </td>
                        <td style={{ textAlign: "end" }}>
                          <Link to={`${heightweightPath}/${dimension.id}`}>
                            <svg
                              className="omrs-icon"
                              fill="rgba(0, 0, 0, 0.54)"
                            >
                              <use xlinkHref="#omrs-icon-chevron-right" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </SummaryCardRowContent>
          </SummaryCardRow>
          <SummaryCardFooter linkTo={`${heightweightPath}`} />
        </SummaryCard>
      ) : (
        <EmptyState
          showComponent={() => openWorkspaceTab(VitalsForm, "Vitals Form")}
          addComponent={VitalsForm}
          name="Height & Weight"
          displayText="This patient has no dimensions recorded in the system."
        />
      )}
    </>
  );
}

type HeightAndWeightOverviewProps = {
  basePath: string;
};
