import moment from 'moment';

import msg from '../../languages';
import FormatUtil from '../FormatUtil';

// purpose of using the single lower quote is to differentiate from commas
// when import to excel, can be detected as delimiter and decode properly
// with single lower quote, we do not need to worry about the comma in the content
const singleLowerQuote = '‚';

const getFileName = (categoryName?: string) => {
  const dateString = moment().format('DD_MMM_YYYY_hh:mm:ss');

  return `${msg().Psa_Lbl_ProjectFinanceFilename}${
    categoryName ? '_' + categoryName : ''
  }${'_' + dateString}.csv`;
};

const getHeaderRows = (workingDays: any, viewType: string) => {
  let final = '';

  let headerArray = [msg().Psa_Lbl_LegendDetails, msg().Com_Lbl_Month];
  if (viewType === 'Weekly') {
    headerArray = [msg().Psa_Lbl_LegendDetails, msg().Cal_Lbl_Week];
  }
  const headerDates = workingDays.workdays.map((e) => {
    if (viewType === 'Weekly') {
      let startDay = `${moment(e.startDate).format('D')}`;
      if (moment(e.endDate).format('MM') !== moment(e.startDate).format('MM')) {
        startDay = `${moment(e.startDate).format('D MMM')}`;
      }
      const endDay = `${moment(e.endDate).format('D MMM')}`;
      return `${startDay} - ${endDay}`;
    }
    return moment(e.startDate, 'YYYY-MM-DD').format('MMM YYYY');
  });
  headerArray = headerArray
    .concat(headerDates)
    .concat(msg().Psa_Lbl_FinanceEAC);

  final = headerArray.join(',').concat('\n');

  let workDaysArray = [
    msg().Psa_Lbl_LegendDetails,
    msg().Psa_Lbl_FinanceWorkDays,
  ];
  const workDays = workingDays.workdays.map((e) => e.workdays);
  workDaysArray = workDaysArray.concat(workDays).concat(workingDays.total);

  return final.concat(workDaysArray.join(',').concat('\n'));
};

const getActivityRows = (activities: any) => {
  let activityRows = '';
  if (activities && activities.length > 0) {
    activities.forEach((activity) => {
      activityRows = activityRows.concat(activity.activityTitle).concat('\n');
      activity.roles.forEach((e) => {
        let assigneeName = e.assigneeName;
        let roleTitle = e.roleTitle;
        assigneeName = assigneeName ? assigneeName.replaceAll(',', singleLowerQuote) : '';
        roleTitle = roleTitle.replaceAll(',', singleLowerQuote);
        let rolePlanAmount = `${roleTitle}${assigneeName},${
          msg().Psa_Lbl_FinancePlan
        },`;
        let rolePlanHours = `${roleTitle}${assigneeName},${
          msg().Psa_Lbl_FinancePlan
        },`;
        let roleActualAmount = `${roleTitle}${assigneeName},${
          msg().Psa_Lbl_FinanceActual
        },`;
        let roleActualHours = `${roleTitle}${assigneeName},${
          msg().Psa_Lbl_FinanceActual
        },`;

        e.intervals.forEach((i) => {
          rolePlanAmount += i.plannedAmt + ',';
          rolePlanHours += i.plannedHours + `${msg().Psa_Lbl_FinanceHours},`;
          roleActualAmount += i.actualAmt + ',';
          roleActualHours += i.actualHours + `${msg().Psa_Lbl_FinanceHours},`;
        });

        rolePlanAmount += e.totalPlannedAmt + '\n';
        rolePlanHours +=
          e.totalPlannedHours + `${msg().Psa_Lbl_FinanceHours}\n`;
        roleActualAmount += e.totalActualAmt + '\n';
        roleActualHours +=
          e.totalActualHours + `${msg().Psa_Lbl_FinanceHours}\n`;

        activityRows = activityRows
          .concat(rolePlanAmount)
          .concat(rolePlanHours)
          .concat(roleActualAmount)
          .concat(roleActualHours);
      });
    });
  }
  return activityRows;
};
export const downloadFinanceOverviewAsCSV = (
  workingDays: any,
  projectFinanceOverview: any,
  viewType: string
) => {
  let final = '';
  final = getHeaderRows(workingDays, viewType);
  const revenuePlanned = [
    msg().Psa_Lbl_FinanceRevenue,
    msg().Psa_Lbl_FinancePlanned,
  ]
    .concat(
      projectFinanceOverview.revenue.intervalTotals
        .map((e) => e.planned)
        .concat(projectFinanceOverview.revenue.eac.plannedTotal)
    )
    .join(',')
    .concat('\n');

  const revenueActual = [
    msg().Psa_Lbl_FinanceRevenue,
    msg().Psa_Lbl_FinanceActual,
  ]
    .concat(
      projectFinanceOverview.revenue.intervalTotals
        .map((e) => e.actual)
        .concat(projectFinanceOverview.revenue.eac.actualTotal)
    )
    .join(',')
    .concat('\n');

  final = final.concat(revenuePlanned, revenueActual);

  const revenueContent = projectFinanceOverview.revenue.finances.map((e) => {
    let modifiedName = e.name;
    modifiedName = modifiedName.replaceAll(',', singleLowerQuote);
    let planned = `${modifiedName},${msg().Psa_Lbl_FinancePlan},`;
    let actual = `${modifiedName},${msg().Psa_Lbl_FinanceActual},`;
    e.intervals.forEach((f) => {
      planned = planned + f.planned + ',';
      actual = actual + f.actual + ',';
    });
    planned = planned.concat(e.eac.plannedTotal).concat('\n');
    actual = actual.concat(e.eac.actualTotal).concat('\n');
    return planned.concat(actual);
  });

  final = final.concat(revenueContent.join(''));

  const costPlanned = [msg().Psa_Lbl_FinanceCost, msg().Psa_Lbl_FinancePlanned]
    .concat(
      projectFinanceOverview.cost.intervalTotals
        .map((e) => e.planned)
        .concat(projectFinanceOverview.cost.eac.plannedTotal)
    )
    .join(',')
    .concat('\n');

  const costActual = [msg().Psa_Lbl_FinanceCost, msg().Psa_Lbl_FinanceActual]
    .concat(
      projectFinanceOverview.cost.intervalTotals
        .map((e) => e.actual)
        .concat(projectFinanceOverview.cost.eac.actualTotal)
    )
    .join(',')
    .concat('\n');

  final = final.concat(costPlanned, costActual);

  const CostContent = projectFinanceOverview.cost.finances.map((e) => {
    let modifiedName = e.name;
    modifiedName = modifiedName.replaceAll(',', singleLowerQuote);
    let planned = `${modifiedName},${msg().Psa_Lbl_FinancePlan},`;
    let actual = `${modifiedName},${msg().Psa_Lbl_FinanceActual},`;
    e.intervals.forEach((f) => {
      planned = planned + f.planned + ',';
      actual = actual + f.actual + ',';
    });
    planned = planned.concat(e.eac.plannedTotal).concat('\n');
    actual = actual.concat(e.eac.actualTotal).concat('\n');
    return planned.concat(actual);
  });

  final = final.concat(CostContent.join(''));

  const marginPlanned = [
    msg().Psa_Lbl_FinanceMargin,
    msg().Psa_Lbl_FinancePlanned,
  ]
    .concat(
      projectFinanceOverview.margin.intervalTotals
        .map((e) => `${FormatUtil.formatNumber(e.planned, 2)}%`)
        .concat(
          `${FormatUtil.formatNumber(
            projectFinanceOverview.margin.eac.plannedTotal,
            2
          )}%`
        )
    )
    .join(',')
    .concat('\n');

  const marginActual = [
    msg().Psa_Lbl_FinanceMargin,
    msg().Psa_Lbl_FinanceActual,
  ]
    .concat(
      projectFinanceOverview.margin.intervalTotals
        .map((e) => `${FormatUtil.formatNumber(e.actual, 2)}%`)
        .concat(
          `${FormatUtil.formatNumber(
            projectFinanceOverview.margin.eac.actualTotal,
            2
          )}%`
        )
    )
    .join(',')
    .concat('\n');

  final = final.concat(marginPlanned, marginActual);

  const csvContent = 'data:text/csv;charset=utf-8,' + final;
  const encodedUri = encodeURI(csvContent);

  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', getFileName());
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadFixedContractAsCSV = (
  workingDays: any,
  projectFinanceDetail: any,
  viewType: string
) => {
  const { finances, financeCategoryName } = projectFinanceDetail;
  let final = '';
  const categoryName = financeCategoryName.replaceAll(',', singleLowerQuote);
  let contract = categoryName + `,${msg().Psa_Lbl_FinanceContract},`;
  let actual = categoryName + `,${msg().Psa_Lbl_FinanceActual},`;
  let estSales = categoryName + `,${msg().Psa_Lbl_FinanceEstSales},`;
  let discount = categoryName + `${msg().Psa_Lbl_FinanceDiscount}`;
  let discountPercent = categoryName + `,${msg().Psa_Lbl_FinanceDiscount}%,`;

  final = getHeaderRows(workingDays, viewType);

  finances.intervalTotals.forEach((e) => {
    contract += e.fixedContract + ',';
    actual += e.fixedActual + ',';
    estSales += e.estSales + ',';
    discount += e.discountAmt + ',';
    discountPercent += e.discountPercent + ',';
  });

  contract += finances.totalFixedContract + '\n';
  actual += finances.totalFixedActual + '\n';
  estSales += finances.totalEstSales + '\n';
  discount += finances.totalDiscountAmt + '\n';
  discountPercent += finances.totalDiscountPercent + '\n';

  final = final
    .concat(contract)
    .concat(actual)
    .concat(estSales)
    .concat(discount)
    .concat(discountPercent);

  final = final.concat(getActivityRows(finances.activities));

  const csvContent = 'data:text/csv;charset=utf-8,' + final;
  const encodedUri = encodeURI(csvContent);

  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', getFileName(financeCategoryName));
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadTnmContractAsCSV = (
  workingDays: any,
  projectFinanceDetail: any,
  viewType: string
) => {
  const { finances, financeCategoryName } = projectFinanceDetail;
  let final = '';
  const categoryName = financeCategoryName.replaceAll(',', singleLowerQuote);
  let plan = categoryName + `,${msg().Psa_Lbl_FinancePlan},`;
  let actual = categoryName + `,${msg().Psa_Lbl_FinanceActual},`;

  final = getHeaderRows(workingDays, viewType);

  finances.intervalTotals.forEach((e) => {
    plan += e.plannedTnMAmt + ',';
    actual += e.actualTnMAmt + ',';
  });

  plan += finances.totalTnMPlanned + '\n';
  actual += finances.totalTnMActual + '\n';

  final = final.concat(plan).concat(actual);

  final = final.concat(getActivityRows(finances.activities));

  const csvContent = 'data:text/csv;charset=utf-8,' + final;
  const encodedUri = encodeURI(csvContent);

  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', getFileName(financeCategoryName));
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadOtherCategoryAsCSV = (
  workingDays: any,
  projectFinanceDetail: any,
  viewType: string
) => {
  const { financeDetails, financeCategoryName, summary } = projectFinanceDetail;
  let final = '';
  const categoryName = financeCategoryName.replaceAll(',', singleLowerQuote);
  let plan = categoryName + `,${msg().Psa_Lbl_FinancePlan},`;
  let actual = categoryName + `,${msg().Psa_Lbl_FinanceActual},`;

  final = getHeaderRows(workingDays, viewType);

  summary.intervalTotals.forEach((e) => {
    plan += e.plannedAmt + ',';
    actual += e.actualAmt + ',';
  });

  plan += summary.totalPlanned + '\n';
  actual += summary.totalActual + '\n';

  final = final.concat(plan).concat(actual);

  const breakDown = financeDetails.map((e) => {
    let modifiedName = e.detailName;
    modifiedName = modifiedName.replaceAll(',', singleLowerQuote);
    let actual = `${modifiedName},${msg().Psa_Lbl_FinanceActual},`;
    e.breakdowns.forEach((b) => {
      actual = actual + b.actualAmt + ',';
    });
    actual = actual.concat(e.totalActual).concat('\n');
    return actual;
  });

  final = final.concat(breakDown.join(''));

  const csvContent = 'data:text/csv;charset=utf-8,' + final;
  const encodedUri = encodeURI(csvContent);

  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', getFileName(financeCategoryName));
  document.body.appendChild(link);
  link.click();
  link.remove();
};
