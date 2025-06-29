import React from "react";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaLocationDot } from "react-icons/fa6";
import Swal from "sweetalert2";
import { MdCancel, MdOutlineEdit } from "react-icons/md";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import L from "leaflet";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIconImg from "../../../../assets/location-pin.png";


// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// create your custom icon
const customIcon  = new L.icon({
  iconUrl:markerIconImg,
   iconSize: [38, 38],      // width and height of the icon
  iconAnchor: [19, 38],    // point of the icon which will correspond to marker's location
  popupAnchor: [0, -38],   // point from which the popup should open relative to the iconAnchor

})

const MyDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedLocation,setSelectedLocation] = useState(null);
  const [showModal,setShowModal] = useState(false);

  //   Fetch Assigned parcelsfor the logged-in DeliveryMan
  const { data: MyDeliveryList = [], refetch } = useQuery({
    queryKey: ["myDeliveryList"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/myDeliveryList?email=${user.email}`);
      return res.data;
    },
  });

  const handleCancel = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const cancelInfo = {
          parcelId: id,
          status: "cancelled",
        };
        const res = await axiosSecure.patch("/parcelStatus", cancelInfo);
        if (res.modifiedCount) {
          refetch();

          Swal.fire({
            title: "cancel!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      }
    });
  };

  const handleDelivered = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Deliver it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deliveredInfo = {
          parcelId: id,
          status: "Delivered",
        };
        const res = await axiosSecure.patch("/parcelStatus", deliveredInfo);
        if (res.data.modifiedCount) {
          refetch();
          Swal.fire({
            title: "Delivered!",
            text: "Parcel has been delivered.",
            icon: "success",
          });
        }
      }
    });
  };

  const handleSeeLocation = (latitude,longitude) =>{
    setSelectedLocation({latitude,longitude});
    setShowModal(true);
  }

  return (


    <div>
       {
        showModal && selectedLocation && (
           <div className="modal modal-open">
          {/* // <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle"> */}
  <div className="modal-box w-11/12 max-w-5xl" >
    <h3 className="font-bold text-3xl mb-4 "> Delivery Location</h3>
    <div className="h-96">
        <MapContainer
          center={[selectedLocation.latitude,selectedLocation.longitude]}
          zoom={13}
          scrollWheelZoom={false}
          style={{height:"100%", width:"100%"}}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[selectedLocation.latitude,selectedLocation.longitude]} icon={customIcon}>
            <Popup>
           Delivery Addresss Location
            </Popup>
          </Marker>
        </MapContainer> 
       </div> 

       <div className="modal-action"><button className="btn-primary text-red-400 text-2xl "
       onClick={()=>setShowModal(false)}>Close</button></div>
       
  </div>
{/* // </dialog> */}
 </div> 
        )
       } 
      <h1 className="text 4xl mb-8">My Delivery List</h1>
     
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="table-auto w-full text-left min-w-[1000px] text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider">
            <tr>
              <th className="px-2 py-4">#</th>
              <th>Booked User's Name</th>
              <th>Receiver's Name</th>
              <th>Booked User's Phone</th>
              <th>Requested Delivery Date</th>
              <th>Assigned Delivery Date</th>
              <th>Receiver's Phone</th>
              <th>Receiver's Address</th>
              <th>View Location</th>
              <th>Cancel</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {MyDeliveryList.map((user, index) => {
              return (
                <tr className="hover:bg-gray-50" key={user._id}>
                  <td className="px-2 py-4">{index + 1}</td>
                  <td className="px-2 py-4">{user.name}</td>
                  <td className="px-2 py-4">{user.receiverName}</td>
                  <td className="px-2 py-4">{user.phoneNumber}</td>
                  <td className="px-2 py-4">{user.requestedDeliveryDate}</td>
                  <td className="px-2 py-4">{user.assignedDate || "Not Assigned"}</td>
                  <td className="px-2 py-4">{user.receiverPhoneNumber}</td>
                  <td className="px-2 py-4">{user.deliveryAddress}</td>

                  <td className="px-2 py-4">
                    <button
                      className="btn"
                      onClick={() =>
                        handleSeeLocation(
                          user.deliveryAddressLatitude,
                          user.deliveryAddressLongitude
                        )
                      }
                    >
                      <FaLocationDot />
                    </button>
                  </td>
                  <td className="px-2 py-4">
                    <button
                      onClick={() => handleCancel(user._id)}
                      className="btn bg-red-500 text-white"
                      disabled={
                        user.status === "Delivered" ||
                        user.status === "Cancelled"
                      }
                    >
                      <MdCancel />
                    </button>
                  </td>
                  <td className="px-2 py-4">
                    <button
                      onClick={() => {
                        handleDelivered(user._id);
                      }}
                      className="btn bg-yellow-500"
                      disabled={
                        user.status === "Delivered" ||
                        user.status === "Cancelled"
                      }
                    >
                      <MdOutlineEdit />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDeliveries;
