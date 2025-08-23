import { Parcel } from "../parcel/parcel.model";

export const getParcelStats = async () => {
  const totalParcelPromise = Parcel.countDocuments();

  const totalParcelByStatusPromise = Parcel.aggregate([
    { $group: { _id: "$currentStatus", count: { $sum: 1 } } },
  ]);

  const monthlyParcelsPromise = Parcel.aggregate([
    { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const [totalParcel, totalParcelByStatusArray, monthlyParcelsArray] =
    await Promise.all([
      totalParcelPromise,
      totalParcelByStatusPromise,
      monthlyParcelsPromise,
    ]);

  const totalParcelByStatus = totalParcelByStatusArray.reduce(
    (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
    {}
  );

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyParcels = monthlyParcelsArray.map((item) => ({
    month: monthNames[item._id - 1],
    count: item.count,
  }));

  return { totalParcel, totalParcelByStatus, monthlyParcels };
};

export const StatsService = {
  getParcelStats,
};
