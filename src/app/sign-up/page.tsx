"use client"
import React, { useState, useEffect } from "react"
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth"
import { auth, db } from "../firebase/config"
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] =
    useState<boolean>(false)

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth)
  const [user] = useAuthState(auth)
  const userRef = collection(db, "users")
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    // Load Google Maps API script
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`
    script.onload = () => {
      setIsGoogleScriptLoaded(true)
    }
    document.head.appendChild(script)

    // Cleanup
    return () => {
      document.head.removeChild(script)
    }
  }, [API_KEY])

  useEffect(() => {
    if (isGoogleScriptLoaded) {
      // Initialize Google Places Autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("autocomplete") as HTMLInputElement,
        { types: ["geocode"] } // Specify the type of place data to return
      )

      // Listen for place selection
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace()
        setAddress(place.formatted_address || "") // Update the address state with the selected place
      })
    }
  }, [isGoogleScriptLoaded])

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password)
      if (res && res.user) {
        const { user } = res

        const userDocRef = doc(userRef, user.uid)
        await setDoc(userDocRef, {
          createdAt: serverTimestamp(),
          uid: user.uid,
          email: user.email,
          username: username,
          address: address,
          firstName: firstName,
          lastName: lastName,
        })
        sessionStorage.setItem("user", "true")
        setEmail("")
        setPassword("")
        setUsername("")
        setAddress("")
        setFirstName("")
        setLastName("")
      }
    } catch (error) {
      setError((error as Error).message)
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
        {error && (
          <p className="text-red-500 mb-4" role="alert">
            {error}
          </p>
        )}
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <label htmlFor="username" className="sr-only">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <label htmlFor="firstName" className="sr-only">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <label htmlFor="lastName" className="sr-only">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <label htmlFor="autocomplete" className="sr-only">
          Address
        </label>
        <input
          id="autocomplete"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          autoComplete="new-address"
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}

export default SignUp
