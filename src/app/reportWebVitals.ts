import { NextWebVitalsMetric } from 'next/app';

const reportWebVitals = (metric: NextWebVitalsMetric) => {
  console.log('log the analytics', metric);
};

export default reportWebVitals;
