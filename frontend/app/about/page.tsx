export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-8 py-16">
      <h1 className="text-4xl font-bold text-slate-800 mb-6 border-b-4 border-blue-500 inline-block">
        About Us
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-6">
        At <strong>EduEquity</strong>, we believe that financial constraints should never stand 
        in the way of a bright future. Our mission is to democratize access to 
        scholarship opportunities for students from all backgrounds.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Our Vision</h3>
          <p className="text-gray-600">To create a world where every student has the resources to pursue their academic dreams.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Our Impact</h3>
          <p className="text-gray-600">Helping thousands of students connect with millions of dollars in funding every year.</p>
        </div>
      </div>
    </div>
  );
}