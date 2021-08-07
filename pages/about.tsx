import React from 'react'
// import Particles from 'react-particles-js';
// import { tsParticles } from "tsparticles";
// import Particles from "react-tsparticles";
// import Particles from "react-tsparticles";





const About = () => {
    
    // const mystyle = {
    //     filter: sepia(1);
    // };

    return (
        <>
        <div className="bg-skin-fill dark:bg-skin-darkmode m-auto flex justify-center h-screen">

            <div className='my-auto'>
            {/* <button 
            className="
            h-auto p-5 bg-skin-button-accent-hover border-2 rounded-md align-middle
            dark:border-white dark:border-2 dark:bg-skin-dark dark:text-skin-muted
            ">
                <small>Krishna</small>
            </button> */}

           <div className=" relative w-40 h-40 ">
           <img src="https://avatars.githubusercontent.com/u/60743337?v=4" className="rounded-full border border-gray-100 shadow-sm 
            filter dark:grayscale" />
           
           <div className="absolute bottom-0 right-0 w-9 h-9 my-2 border-2 border-white rounded-full bg-green-400 dark:bg-gray-500 z-2
           	hover:bg-skin-dark hover:scale-200
           ">
               
           </div>
           </div>
            </div>

            
            
        </div>
        
        </>
    )
}

export default About
