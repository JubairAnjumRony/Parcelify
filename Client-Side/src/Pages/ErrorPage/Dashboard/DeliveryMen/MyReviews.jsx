import React from "react";
import { useEffect } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import { useState } from "react";

const MyReviews = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchReviews = async () => {
      const res = await axiosSecure.get(`/feedback/${user?.email}`);
      setReviews(res.data);
    };
    if (user?.email) {
      fetchReviews();
    }
  }, [axiosSecure, user?.email]);

  console.log(user.email);

//   return (
//     <div className="card bg-base-100 w-96 shadow-sm">
//       {reviews.map((review) => 
//       (
//           <div key={review._id} className="card-body">
//             <figure>
//               <img src={review.user_image} alt="Shoes" />
//             </figure>
//             <h2 className="card-title">Card Title</h2>
//             <p>{review.feedback}</p>
//             <br></br>
//             <p>{review.rating}</p>
//             <p>{review.feedbackDate}</p>
//             <div className="card-actions justify-end">
//               <button className="btn btn-primary">Buy Now</button>
//             </div>
//           </div>
//         );
//     )
    
//       }
//     </div>
//   );
// };

// export default MyReviews;


return (
    <div className="space-y-4 p-4">
      {reviews.map((review) => (
        <div key={review._id} className="card bg-base-100 w-96 shadow-sm">
                <figure>
            <img
              src={review.user_image}
              alt="Reviewer"
              className="w-full h-40 object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{review.reviewerName || "Review"}</h2>
            <p>{review.feedback}</p>
            <p>⭐ {review.rating}</p>
            <p>Date: {review.feedbackDate}</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyReviews;
