import React from "react";

const HomePg = () => {
  const features = [
    {
      title: "Shared Resource Library",
      description:
        "Students can access and upload materials, creating a collaborative academic vault. All materials are stored in categories for easy navigation and sharing.",
    },
    {
      title: "Q&A Manager",
      description:
        "Ask doubts, upload solutions, and organize queries by categories. Admins can manage categories, and students can request new ones.",
    },
    {
      title: "Important Emails and Websites Library",
      description:
        "Get quick access to all important email IDs and websites in one organized list. Stay connected and informed at all times.",
    },
    {
      title: "Lost & Found Manager",
      description:
        "Upload and find lost items by categories such as CEP, LT, and canteen. Found items are auto-tagged and removed when resolved.",
    },
  ];

  return (
    <div className="m-6 flex flex-col items-center pt-16">
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-primary-content text-center py-12 rounded-lg shadow-lg mb-12 w-full max-w-4xl">
        <h1 className="text-6xl font-bold text-blue-300 tracking-wide">
          aDApt: Collaborative Platform for Students
        </h1>
        <p className="text-lg mt-4 text-gray-400 italic">
          Where students connect, share, and grow together.
        </p>
        <div
          className="absolute inset-0 bg-[url('/path/to/code-background-image.jpg')] opacity-10 pointer-events-none"
          style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="card bg-blue-100 text-gray-800 shadow-md p-6 rounded-lg w-full max-w-sm transform transition-transform duration-300 hover:scale-105 hover:bg-gray-200"
          >
            <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
            <p className="text-base leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePg;
