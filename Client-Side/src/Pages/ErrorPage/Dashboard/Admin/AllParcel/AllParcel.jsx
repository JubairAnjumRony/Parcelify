import React from "react";
import useAxiosSecure from "../../../../../hooks/useAxiosSecure";
import useUsers from "../../../../../hooks/useUsers";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../../hooks/useAxiosPublic";
import useParcels from "../../../../../hooks/useParcels";
// import axios from "axios";

const AllParcel = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [parcels, refetch] = useParcels();
  const [users] = useUsers();
  const [allParcels, setAllParcels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectDeliveryMan, setSelectDeliveryMan] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openModal, setOpenModal] = useState(null);

  useEffect(() => {
    setAllParcels(parcels);
  }, [parcels]);

  const deliveryMan = Array.isArray(users)
    ? users.filter((user) => user.role === "deliveryMen")
    : [];

  const now = moment().format("YYYY-MM-DD");

  const handleAssign = async(event, parcelId) => {
    event.preventDefault();
    setLoading(true);
    if (!selectDeliveryMan || !deliveryDate) {
      Swal.fire({
        icon: "error",
        tittle: "Missing Information",
        text: "please select  a delivery man and specify the delivery date",
      });
      setLoading(false);
      return;
    }

    const assignedData = {
      parcelId,
      deliveryManId: selectDeliveryMan,
      assignDate: deliveryDate,
      status: "on The way",
    };

    try {
      const res = await axiosSecure.post("/deliveryAssign", assignedData);
      if(res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Delivery Man Assigned!",
          text: "Parcel was updated successfully",
        });
        refetch();
        closeReviewModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Assignment Failed",
          text: "No documents were modified",
        });
      }
    } catch (error) {
      console.error("error", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Assign DeliveryMan",
        text: "Check your frontend and apis",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async() => {
    try {
      const fomattedStartDate = startDate
        ?moment(startDate)
        .format("YYYY-MM-DD") :" ";
      const formattedEndDate = endDate ? moment(endDate).format("YYYY-MM-DD") : "";
      const res = await axiosSecure.get(`/allParcels?startDate=${fomattedStartDate}&endDate=${formattedEndDate}`
      );
      setAllParcels(res.data);
    } catch (error) {
      console.error("error Fetching Data ", error);
    }
  };

  const resetFilters = () => {
    setAllParcels(parcels);
  };

  const openModalID = (parcelid) => {
    setOpenModal(parcelid);
  };

  const closeReviewModal = () => {
    setOpenModal(null);
  };

  return (
    <div>
      <h2 className="text-3xl mb-10">All Parcels</h2>

      <div className="flex justify-evently mb-8">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Start Date</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input input-bordered w-full"
          ></input>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">End Date</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input input-bordered w-full"
          ></input>
        </div>

        <button className="btn" onClick={handleSearch}>
          Search
        </button>
        <button className="btn" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>UserName</th>
              <th>UserPhone</th>
              <th>Booking Date</th>
              <th>Req.DeliveredDate</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Manage</th>
            </tr>
          </thead>

          <tbody>
            {allParcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.name}</td>
                <td>{parcel.phonenumber}</td>
                <td>{parcel.bookingDate}</td>
                <td>{parcel.requestedDeliveryDate}</td>
                <td>{parcel.price}</td>
                <td className="text-yellow-400">{parcel.status}</td>
                <td>
                  <button
                    className="btn bg-blue-300 text-white "
                    onClick={() => openModalID(parcel._id)}
                  >
                    Manage
                  </button>
                  {openModal === parcel._id && (
                    <dialog open className="modal">
                      <form
                        onSubmit={(event) => handleAssign(event, parcel._id)}
                        className="form-control bg-base-100 rounded-lg p=10 border-2"
                      >
                        <h2 className="text-3xl items-center text-center my-8">
                          {" "}
                          Manage Parcel
                        </h2>
                        <div className="p-5">
                          <label className="label-text">
                            Assign DeliveryMan
                          </label>
                          <select
                            className="w-full py-2 bg-gray-500"
                            value={selectDeliveryMan}
                            onChange={(e) =>
                              setSelectDeliveryMan(e.target.value)
                            }
                          >
                            <option>Select DeliveryMan</option>
                            {deliveryMan.map((deliveryMan) => (
                              <option
                                key={deliveryMan._id}
                                value={deliveryMan._id}
                              >
                                {deliveryMan.name}
                              </option>
                            ))}
                          </select>

                          <div className="mt-2">
                            <label className="font-bold text-lg mb-2">
                              Approximate Delivery Date:
                            </label>

                            <input
                              className="w-full border-gray py-2 bg-gray-500"
                              type="date"
                              min={now}
                              value={deliveryDate}
                              onChange={(e) => setDeliveryDate(e.target.value)}
                            />
                          </div>

                          <div className="flex gap-4">
                            <button
                              type="submit"
                              className="btn bg-blue-400 text-white"
                            >
                              Assign
                            </button>
                            <button
                              type="button"
                              className="btn"
                              onClick={closeReviewModal}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    </dialog>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllParcel;


// const AllParcel = () => {
//     const axiosPublic = useAxiosPublic();
//     const [parcels, refetch] = useParcels();
//     const [allParcels,setAllParcels] =useState([]);
//     const [users] = useUsers();
//     const [loading, setLoading] = useState(false);
//     const [selectedDeliveryMan, setSelectedDeliveryMan] = useState("");
//     const [deliveryDate, setDeliveryDate] = useState("");
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [openManageModalId, setOpenManageModalId] = useState(null);
//     const axiosSecure =useAxiosSecure();

//     useEffect(()=>{
//         setAllParcels(parcels);
//     },[parcels]);

//     const deliveryMen = Array.isArray(users)
//         ? users.filter((user) => user.role === "deliveryMen")
//         : [];

//     const now = moment().format("YYYY-MM-DD");

//     const handleAssign = (event, parcelId) => {
//         event.preventDefault();
//         setLoading(true);

//         if (!selectedDeliveryMan || !deliveryDate) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Missing Information",
//                 text: "Please select a delivery man and specify the delivery date.",
//             });
//             setLoading(false);
//             return;
//         }

//         const assignedData = {
//             parcelId,
//             deliveryManId: selectedDeliveryMan,
//             assignDate: deliveryDate,
//             status: "On The Way",
//         };

//         axiosPublic
//             .post("/deliveryAssign", assignedData)
//             .then((res) => {
//                 if (res.data.modifiedCount > 0) {
//                     Swal.fire({
//                         position: "top-end",
//                         icon: "success",
//                         title: "DeliveryMan Assigned Successfully",
//                         showConfirmButton: false,
//                         timer: 1500,
//                     });
//                     refetch();
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error assigning delivery:", error);
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: "Something went wrong. Please try again.",
//                 });
//             })
//             .finally(() => setLoading(false));
//     };

//     const openManageModal = (parcelId) => {
//         setOpenManageModalId(parcelId);
//     };

//     const closeReviewModal = () => {
//         setOpenManageModalId(null);
//     };


//     // function to handle search functionality
//     const handleSearch = async () => {
//         try {
//         //   const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
//         //   console.log(formattedStartDate);
//         //   const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';
//         const formattedStartDate = startDate ? moment(startDate).format("YYYY-MM-DD") : '';
//          const formattedEndDate = endDate ? moment(endDate).format("YYYY-MM-DD") : '';
          
//         //   console.log(formattedEndDate);
//           const result = await axiosSecure.get(`/allParcels?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
//           // refetch(result.data);
//         //   console.log(result);
//           setAllParcels(result.data);
//         } catch (error) {
//           console.error('Error fetching parcels:', error);
//         }
//       };
    
//       const resetFilters = () => {
//         setAllParcels(parcels); // Reset local state to original data
//         // refetch();
//     };
    

//     return (
//         <div>

//              {/* <Helmet>
//                             <title>Dashboard || AllParcels</title>
//                         </Helmet> */}
//             <h2 className="text-3xl mb-10">All Parcels: {parcels.length}</h2>


//           {/* search section */}
//           <div className="flex justify-evenly mb-8">
//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Start Date</span>
//           </label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="input input-bordered w-full"
//           />
//         </div>
        
//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">End Date</span>
//           </label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="input input-bordered w-full"
//           />
//         </div>
//         <button className="btn" onClick={handleSearch}>
//           Search
//         </button>
//         <button className="btn" onClick={resetFilters}>
//                     Reset Filters
//                 </button>
//       </div>


            
//             <div className="overflow-x-auto">
//                 <table className="table table-zebra w-full">
//                     <thead>
//                         <tr>
//                             <th>User Name</th>
//                             <th>User Phone</th>
//                             <th>Booking Date</th>
//                             <th>Req. Delivery Date</th>
//                             <th>Cost</th>
//                             <th>Status</th>
//                             <th>Manage</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {allParcels.map((parcel) => (
//                             <tr key={parcel._id}>
//                                 <td>{parcel.name}</td>
//                                 <td>{parcel.phoneNumber}</td>
//                                 <td>{parcel.bookingDate}</td>
//                                 <td>{parcel.requestedDeliveryDate}</td>
//                                 <td>{parcel.price}</td>
//                                 <td className="text-yellow-400">{parcel.status}</td>
//                                 <td>
//                                     <button
//                                         className="btn bg-blue-600 text-white"
//                                         onClick={() => openManageModal(parcel._id)}
//                                     >
//                                         Manage
//                                     </button>
//                                     {openManageModalId === parcel._id && (
//                                         <dialog open className="modal">
//                                             <form
//                                                 onSubmit={(event) =>
//                                                     handleAssign(event, parcel._id)
//                                                 }
//                                                 className="form-control bg-base-100 rounded-lg p-10 border-2"
//                                             >
//                                                 <h2 className="text-2xl font-bold text-blue-300 ">
//                                                     Manage Parcel
//                                                 </h2>
//                                                 <div className="p-5">
//                                                     <label className="font-bold mb-2  text-lg ">
//                                                         Assign Delivery Man:
//                                                     </label>
//                                                     <select
//                                                       className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 bg-white text-gray-800"
//                                                         value={selectedDeliveryMan}
//                                                         onChange={(e) =>
//                                                             setSelectedDeliveryMan(
//                                                                 e.target.value
//                                                             )
//                                                         }
//                                                     >
//                                                         <option value="">
//                                                             Select Delivery Man
//                                                         </option>
//                                                         {deliveryMen.map(
//                                                             (deliveryMan) => (
//                                                                 <option
//                                                                     key={deliveryMan._id}
//                                                                     value={deliveryMan._id}
//                                                                 >
//                                                                     {deliveryMan.name}
//                                                                 </option>
//                                                             )
//                                                         )}
//                                                     </select>
//                                                     <div className="mt-2">
//                                                         <label className="font-bold text-lg  mb-2">
//                                                             Approximate Delivery Date:
//                                                         </label>
//                                                         <input
//                                                           className="w-full border border-gray rounded-xl px-4 py-2 mb-6 bg-gray-400 text-gray-600"
//                                                             type="date"
//                                                             min={now}
//                                                             value={deliveryDate}
//                                                             onChange={(e) =>
//                                                                 setDeliveryDate(
//                                                                     e.target.value
//                                                                 )
//                                                             }
//                                                         />
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex gap-5">
//                                                     <button
//                                                         type="submit"
//                                                         className="btn bg-blue-500 text-white border-0"
//                                                     >
//                                                         Assign
//                                                     </button>
//                                                     <button
//                                                         type="button"
//                                                         className="btn"
//                                                         onClick={closeReviewModal}
//                                                     >
//                                                         Cancel
//                                                     </button>
//                                                 </div>
//                                             </form>
//                                         </dialog>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default AllParcel;

