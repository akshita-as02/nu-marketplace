"use client"

import Loader from "@/components/Loader"
import ProductCard from "@/components/ProductCard"
import { getProductDetails } from "@/lib/actions/actions"
import { useUser } from "@clerk/nextjs"
import { use, useEffect, useState } from "react"

const Wishlist = () => {
  const { user } = useUser()

  const [loading, setLoading] = useState(true)
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null)
  const [wishlist, setWishlist] = useState<ProductType[]>([])

  const getUser = async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      setSignedInUser(data)
      console.log("data: ",data);
      setLoading(false)
    } catch (err) {
      console.log("[users_GET", err)
    }
  }
  // const getUser = async () => {
  //   try {
  //     const token = await user?.getToken();
  //     if (!token) throw new Error("No token found");
  
  //     const res = await fetch("/api/users", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     if (!res.ok) {
  //       throw new Error(`Error: ${res.status}`);
  //     }
  
  //     const data = await res.json();
  //     setSignedInUser(data);
  //   } catch (err) {
  //     console.error("[users_GET]", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  useEffect(() => {
    if (user) {
      getUser()
    }
  }, [user])

  const getWishlistProducts = async () => {
    setLoading(true)
  
    if (!signedInUser || !signedInUser.wishlist) {
      setLoading(false)
      return
    }
  
    const wishlistProducts = await Promise.all(signedInUser.wishlist.map(async (productId) => {
      const res = await getProductDetails(productId)
      return res
    }))
  
    setWishlist(wishlistProducts)
    setLoading(false)
  }
  

  useEffect(() => {
    if (signedInUser) {
      getWishlistProducts()
    }
  }, [signedInUser])

  const updateSignedInUser = (updatedUser: UserType) => {
    setSignedInUser(updatedUser)
  }
console.log("wishlist: ",wishlist);
console.log("signedInUser: ",signedInUser);
console.log("user: ",user);

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <p className="text-heading3-bold my-10">Your Wishlist</p>
      {wishlist.length === 0 && (
        <p>No items in your wishlist</p>
      )}

      <div className="flex flex-wrap justify-center gap-16">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} updateSignedInUser={updateSignedInUser}/>
        ))}
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic";

export default Wishlist