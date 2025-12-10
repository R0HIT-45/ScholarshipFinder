export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto p-8 py-16">
      <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">Contact Us</h1>
      
      <div className="bg-white rounded-xl shadow-xl p-8">
        <div className="space-y-4 text-center">
          <p className="text-xl text-gray-700">
            Have questions? We are here to help.
          </p>
          <div className="py-4">
            <p className="font-semibold text-gray-800">Email:</p>
            <p className="text-blue-600 text-lg">support@eduequity.com</p>
          </div>
          <div className="py-4">
            <p className="font-semibold text-gray-800">Address:</p>
            <p className="text-gray-600">123 Education Lane, Knowledge City</p>
          </div>
          <button className="bg-slate-800 text-white px-6 py-2 rounded-full hover:bg-slate-700 transition mt-4">
            Send us a Message
          </button>
        </div>
      </div>
    </div>
  );
}