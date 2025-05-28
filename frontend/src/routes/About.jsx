import React from 'react';
import Navbar from '../components/Navbar';

function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-base-200 text-white">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 md:p-12">
            <h1 className="text-4xl font-bold text-center mb-8 text-green-400">About Us</h1>

            <div className="bg-base-100 shadow-2xl border border-green-600 rounded-lg p-8">
              <p className="text-lg leading-relaxed mb-6 text-gray-300">
                <span className="text-green-400 font-semibold">Macrology</span> is a modern macro counter web application — designed for anyone looking to track calories, protein, carbs, and fats in a clean, focused space.
                Whether you're working toward a fitness goal or just want more insight into your nutrition, <span className="text-green-400 font-semibold">Macrology</span> helps you do it with clarity and ease.
              </p>

              {/* WHY WE BUILT THIS */}
              <div className="mt-10 bg-gray-900 p-6 rounded-lg border border-gray-700 text-center">
                <h2 className="text-2xl font-bold mb-4 text-green-400">Why We Built This</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We created <span className="text-green-400 font-semibold">Macrology</span> because we were tired of juggling multiple fitness apps, notes, and spreadsheets to track what we eat. We wanted a central place where we could:
                  <br /><br />
                  ✦ Log daily macros with ease.<br />
                  ✦ Visualize progress with clean and simple charts.<br />
                  ✦ Keep things minimal — no clutter, just your data.
                  <br /><br />
                  Whether you're a gym goer, a nutrition nerd, or someone starting their health journey — you're in the right place.
                </p>
              </div>

              {/* TEAM / MISSION / VISION CARDS */}
              <div className="grid md:grid-cols-3 gap-8 text-center mt-10">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:scale-105 transition">
                  <h3 className="font-bold text-lg mb-2 text-green-400">Our Team</h3>
                  <p className="text-sm text-gray-400">A team of developers, designers, and wellness advocates who believe simplicity empowers consistency.</p>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:scale-105 transition">
                  <h3 className="font-bold text-lg mb-2 text-green-400">Our Mission</h3>
                  <p className="text-sm text-gray-400">To help people reach their nutrition goals with tools that are intuitive, insightful, and distraction-free.</p>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:scale-105 transition">
                  <h3 className="font-bold text-lg mb-2 text-green-400">Our Vision</h3>
                  <p className="text-sm text-gray-400">To become the go-to platform for macro tracking — simple enough for beginners, powerful enough for pros.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer sm:footer-horizontal bg-base-300 text-base-content p-10 flex justify-around">
            <nav>
            <h6 className="footer-title">Features</h6>
            <a className="link link-hover">Macro Tracking</a>
            <a className="link link-hover">Visual Dashboards</a>
            <a className="link link-hover">Meal Logs</a>
            <a className="link link-hover">Progress Insights</a>
          </nav>
          <nav>
            <h6 className="footer-title">Company</h6>
            <a className="link link-hover">About Us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Careers</a>
            <a className="link link-hover">Press</a>
          </nav>
            <nav>
              <h6 className="footer-title">Social</h6>
              <div className="grid grid-flow-col gap-7 text-white">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M24 4.557a9.83 9.83 0 01-2.828.775A4.932 
                      4.932 0 0023.337 3.1a9.864 9.864 0 01-3.127 
                      1.195 4.916 4.916 0 00-8.38 4.482A13.94 
                      13.94 0 011.671 3.149 4.916 4.916 0 003.195 
                      9.723a4.9 4.9 0 01-2.229-.616c-.054 
                      2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 
                      4.928 4.928 0 004.6 3.417 9.867 9.867 0 01-6.102 
                      2.104c-.396 0-.787-.023-1.175-.069A13.945 
                      13.945 0 007.548 21c9.142 0 14.307-7.721 
                      13.995-14.646A10.025 10.025 0 0024 4.557z" />
                  </svg>
                </a>

                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 
                      0-3.897.266-4.356 2.62-4.385 
                      8.816.029 6.185.484 8.549 4.385 8.816 
                      3.6.245 11.626.246 15.23 0 3.897-.266 
                      4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 
                      15.999v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>

                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 
                      1.115-1.333h2.885v-5h-3.808c-3.596 
                      0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
              </div>
            </nav>
          </footer>
      </div>
    </>
  );
}

export default AboutPage;
