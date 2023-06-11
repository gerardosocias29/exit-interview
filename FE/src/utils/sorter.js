export const sortFormatData = (reco) => {
  return reco.sort((a, b) => a.values - b.values);
};

export const chartFormatData = (reco, c) => {
  if (!reco.data) {
    return;
  }
  const cat = reco.filter((item) => item.form === c);
  const sorted = reco.data[0].recommendations.sort((a, b) => a.values - b.values);
  const topFive = sorted.splice(0, 4);

  console.log(reco.data[0].recommendations);
  // return topFive.map((t) => ({
  //   [t]: {
  //     labels: reco.data[0].recommendations.map((a) => a.label),
  //     datasets: {
  //       label: 'recommendation',
  //       data: reco.data[0].recommendations.map((a) => a.values),
  //       backgroundColor: '#3344ff',
  //     },
  //   },
  // }));
  return {
    labels: topFive.map((a) => a.label),
    datasets: {
      label: 'recommendation',
      data: topFive.map((a) => a.values),
      backgroundColor: '#3344ff',
    },
  };
};
