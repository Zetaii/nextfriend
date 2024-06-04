"use client"
import React, { useState, useEffect, useRef } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../firebase/config"
import { collection, getDoc, doc, getDocs } from "firebase/firestore"
import Chat from "../components/Chat"
import FriendBox from "../components/FriendBox"
import GoogleAutoComplete from "../components/GoogleAutoComplete"
import {
  GoogleMap,
  useLoadScript,
  DirectionsService,
} from "@react-google-maps/api"
import MaxWidthWrapper from "../components/MaxWidthWrapper"
import Image from "next/image"

interface UserData {
  address: string
  // Add other properties if available
}

interface FriendTravelTime {
  travelTime: number
  address: string
}

interface FriendTravelTimes {
  [friendId: string]: FriendTravelTime
}

type LatLng = { lat: number; lng: number }
type Address = string

// Define types for friend information
interface FriendInfo {
  friendId: string
  friendUsername: string
  friendAddress: Address
}

// Define types for travel time information
interface TravelTimeInfo {
  username: string
  travelTime: number
  address: Address
}

export const MapPage: React.FC = (): any => {
  const [origin, setOrigin] = useState<Address>("")
  const [destination, setDestination] = useState<Address>("")
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [travelTime, setTravelTime] = useState<number | null>(null)
  const [users, setUsers] = useState<any[] | null>(null) // Adjust the type as needed
  const [userData, setUserData] = useState<UserData | null>(null)
  const [friendTravelTimes, setFriendTravelTimes] = useState<FriendTravelTimes>(
    {}
  )
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([])

  const [user] = useAuthState(auth)
  const destinationInputRef = useRef<HTMLInputElement>(null)

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  const libraries: ("places" | "geometry")[] = ["places"]
  const mapContainerStyle: React.CSSProperties = {
    width: "22vw",
    height: "25vh",
    borderRadius: "50px",
  }
  const center: google.maps.LatLngLiteral = {
    lat: 44.97007, // default latitude
    lng: -93.28378, // default longitude
  }

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid)
          const docSnapshot = await getDoc(userDocRef)
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data() as UserData
            setUserData(userData)
          } else {
            console.log("No such document!")
          }
        }
      } catch (error) {
        console.error("Error getting document:", error)
      }
    }
    fetchDocument()
  }, [user])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users")
        const querySnapshot = await getDocs(usersRef)
        const fetchedUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
        setUsers(fetchedUsers)
        console.log("Fetched users:", fetchedUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  const handleDirectionsResponse = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === "OK" && response) {
      const route = response.routes[0]
      if (route && route.legs && route.legs[0] && route.legs[0].duration) {
        const travelTimeInSeconds = route.legs[0].duration.value
        const travelTimeInMinutes = Math.ceil(travelTimeInSeconds / 60)
        setTravelTime(travelTimeInMinutes)
      } else {
        console.error("Incomplete or invalid route information")
      }
    } else {
      console.error("Directions request failed due to", status)
    }
  }

  const calculateRoute = (
    origin: LatLng | Address,
    destination: LatLng | Address,
    setTravelTime: (time: number) => void
  ) => {
    // Check if origin and destination are provided
    if (!origin || !destination) {
      console.error("Origin or destination not provided")
      return
    }

    // Define DirectionsService options
    const directionsServiceOptions = {
      origin: typeof origin === "string" ? { query: origin } : origin,
      destination:
        typeof destination === "string" ? { query: destination } : destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }

    // Request directions using DirectionsService
    const directionsService = new google.maps.DirectionsService()
    directionsService.route(directionsServiceOptions, handleDirectionsResponse)
  }

  const handleCalculateTravelTime = (
    destination: string,
    setTravelTime: (time: number) => void
  ) => {
    // Check if user's address is available
    if (!userData || !userData.address) {
      console.error("User data not available")
      return
    }

    // Calculate the route and set travel time
    calculateRoute(userData.address, destination, setTravelTime)
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  })

  if (loadError) {
    return <div>Error loading maps</div>
  }

  if (!isLoaded) {
    return <div>Loading maps</div>
  }

  const handleFriendBoxButtonClick = (
    friendAddress: any,
    friendUsername: any
  ) => {
    if (!destination || !friendAddress) {
      console.error("Destination or friend address not available")
      return
    }

    calculateFriendRoute(
      destination,
      friendAddress,
      friendUsername,
      origin,
      destination
    )
  }

  const calculateFriendRoute = (
    origin: string,
    destination: string,
    friendId: string,
    friendUsername: string,
    friendAddress: string
  ) => {
    const directionsService = new window.google.maps.DirectionsService()
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (
          status === "OK" &&
          response &&
          response.routes &&
          response.routes[0] &&
          response.routes[0].legs &&
          response.routes[0].legs[0] &&
          response.routes[0].legs[0].duration
        ) {
          const route = response.routes[0]
          if (route && route.legs && route.legs[0] && route.legs[0].duration) {
            const travelTimeInSeconds = route.legs[0].duration.value
            const travelTimeInMinutes = Math.ceil(travelTimeInSeconds / 60)
            setFriendTravelTimes((prev) => ({
              ...prev,
              [friendId]: {
                username: friendUsername,
                travelTime: travelTimeInMinutes,
                address: friendAddress,
              },
            }))
          } else {
            console.error(
              `Directions request for ${friendUsername} failed due to`,
              status
            )
          }
        }
      }
    )
  }
  return (
    <>
      <DirectionsService
        options={{
          origin: typeof origin === "string" ? { query: origin } : origin,
          destination:
            typeof destination === "string"
              ? { query: destination }
              : destination,
          travelMode: google.maps.TravelMode.DRIVING,
        }}
        callback={handleDirectionsResponse}
      />
      <div className="h-screen flex flex-col bg-zinc-900 ">
        <MaxWidthWrapper>
          <div className="w-[25%]">
            <Chat />
          </div>
          <div className=" justify-center flex mt-6">
            <h1 className="text-3xl font-extrabold bg-zinc-700 p-2">
              Find the closest locations!
            </h1>
          </div>
          <div className="flex justify-center ">
            <div className="w-[100%] mt-14">
              <div className="w-full bg-zinc-950 rounded-xl pb-12 px-6 h-[40%] border-2 border-white">
                <h1 className="text-center mb-10 text-white pt-4   text-xl font-bold">
                  Travel Info
                </h1>

                <div className="mx-1 w-full text-center flex mb-2 mr-20 justify-center">
                  <div className="justify-center">
                    <Image
                      src="/home.png"
                      alt="home icon"
                      width={32}
                      height={32}
                    />
                  </div>
                  <label
                    className="pr-6 ml-1 text-center text-white font-bold"
                    htmlFor="originInput"
                  >
                    Origin
                  </label>
                  <input
                    className="text-black text-center w-50% px-2 border-2 border-slate-400 rounded ml-6 py-1"
                    type="text"
                    placeholder={
                      !userData || !userData.address ? "Enter origin..." : ""
                    }
                    value={userData && userData.address ? userData.address : ""}
                    readOnly
                    id="originInput"
                  />
                </div>
                <div className="justify-center flex ">
                  <GoogleAutoComplete
                    destinationInputRef={destinationInputRef}
                    setDestination={(destination) =>
                      setDestination(destination)
                    }
                    onDestinationSelected={(destination) => {
                      handleCalculateTravelTime(destination, setTravelTime)
                    }}
                    userOrigin={
                      userData && userData.address ? userData.address : ""
                    }
                  />
                </div>
                <div className="justify-center flex">
                  <div className="flex ml-1 text-center">
                    <Image
                      src="/clock.png"
                      alt="clock icon"
                      width={32}
                      height={32}
                    />
                    <p className=" ml-1  text-center font-bold text-white">
                      Travel Time
                    </p>
                    <div className="">
                      <input></input>
                      {travelTime && (
                        <div className="text-black bg-white text-center w-56  border-2 ml-1 border-slate-400 rounded py-1">
                          {travelTime} minutes
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center mt-[40%] bg-zinc-950 border-white border-2 py-12  rounded-xl">
                <FriendBox
                  onFriendBoxButtonClick={handleFriendBoxButtonClick}
                />

                <div className="flex flex-col items-center mt-2 ml-1 font-bold text-white">
                  <div className="mb-4 text-center">Friend Travel Times:</div>
                  {Object.entries(friendTravelTimes).map(
                    ([friendId, { travelTime, address }]) => (
                      <div
                        key={friendId}
                        className="mb-2 bg-white rounded-md w-56 p-1 border-2 border-slate-400"
                      >
                        <div className="flex justify-between items-center">
                          <p className="mr-2 text-center">{friendId}</p>
                          <p className="text-black text-base font-normal">
                            {travelTime} minutes
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <div className="mt-12 ml-32 ">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={9}
                  center={center}
                  onLoad={setMap}
                ></GoogleMap>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  )
}
