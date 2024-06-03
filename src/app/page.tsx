import React from "react"

const LandingPage = () => {
  return (
    <div className="bg-slate-800 min-h-[83vh] flex flex-col">
      <main className="container mx-auto my-8 flex-grow">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About Us</h2>
          <p className="text-black">
            Welcome to{" "}
            <span className="font-bold text-blue-600">FriendMap</span>! We are a
            website that helps you find locations and services in your area for
            you and your{" "}
            <span className="font-bold text-blue-600">friends</span>.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Services</h2>
          <p>Our company offers a wide range of services to meet your needs.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p>Feel free to contact us for any inquiries or questions.</p>
        </section>
      </main>
    </div>
  )
}

export default LandingPage
