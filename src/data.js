// src/data.js

// Updated Static Data (20 professionals - No Images)
export const staticProfessionalsData = [
  { id: 1, name: "Aarav Mehta", profession: "Plumber", rating: 4.7, rate: 480, desc: "Expert in pipe fitting and leak repairs with fast service.", location: "Mumbai", skills: ["Leak Repair", "Pipe Fixing"], isVerified: true, image: "https://randomuser.me/api/portraits/men/11.jpg" },
  { id: 2, name: "Diya Kapoor", profession: "UI Designer", rating: 4.8, rate: 1000, desc: "Expert in UI/UX and responsive web design.", location: "Bangalore", skills: ["Figma", "Wireframes"], isVerified: true, image: "https://randomuser.me/api/portraits/women/21.jpg" },
  { id: 3, name: "Krishna Rao", profession: "Electrician", rating: 4.6, rate: 600, desc: "Certified electrician for home and office electrical setups.", location: "Hyderabad", skills: ["Wiring", "Smart Home"], isVerified: false, image: "https://randomuser.me/api/portraits/men/12.jpg" },
  { id: 4, name: "Sanya Jain", profession: "Photographer", rating: 5.0, rate: 1400, desc: "Creative wedding and portrait photographer.", location: "Delhi", skills: ["Weddings", "Portraits"], isVerified: true, image: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: 5, name: "Vivaan Shukla", profession: "Car Mechanic", rating: 4.5, rate: 800, desc: "Car diagnostic expert with doorstep service.", location: "Pune", skills: ["Engine Repair", "Diagnostics"], isVerified: true, image: "https://randomuser.me/api/portraits/men/25.jpg" },
  { id: 6, name: "Ishita Verma", profession: "Web Developer", rating: 4.9, rate: 1200, desc: "Full-stack developer with React & Node expertise.", location: "Chennai", skills: ["React", "Node"], isVerified: true, image: "https://randomuser.me/api/portraits/women/9.jpg" },
  { id: 7, name: "Sarthak Khanna", profession: "Electrician", rating: 4.4, rate: 550, desc: "Specialist in inverter and wiring installation.", location: "Delhi", skills: ["Wiring", "Switches"], isVerified: false, image: "https://randomuser.me/api/portraits/men/13.jpg" },
  { id: 8, name: "Natasha Pillai", profession: "Graphic Designer", rating: 4.8, rate: 900, desc: "Branding, logos and digital marketing creatives.", location: "Remote", skills: ["Branding", "Logos"], isVerified: true, image: "https://randomuser.me/api/portraits/women/12.jpg" },
  { id: 9, name: "Ayaan Sheikh", profession: "Appliance Technician", rating: 4.3, rate: 450, desc: "AC and fridge repair with 1-year service warranty.", location: "Mumbai", skills: ["AC Repair", "Washing Machine"], isVerified: true, image: "https://randomuser.me/api/portraits/men/14.jpg" },
  { id: 10, name: "Aditi Sharma", profession: "Beauty Specialist", rating: 4.7, rate: 750, desc: "Certified beautician offering home services.", location: "Bangalore", skills: ["Makeup", "Hair Styling"], isVerified: true, image: "https://randomuser.me/api/portraits/women/14.jpg" },
  { id: 11, name: "Harsh Gupta", profession: "Deep Cleaner", rating: 4.6, rate: 650, desc: "Professional deep cleaning for flats and offices.", location: "Hyderabad", skills: ["Deep Cleaning"], isVerified: false, image: "https://randomuser.me/api/portraits/men/22.jpg" },
  { id: 12, name: "Simran Arora", profession: "Tutor", rating: 5.0, rate: 500, desc: "Math & coding tutor for 6–12th grade.", location: "Remote", skills: ["Maths", "Python"], isVerified: true, image: "https://randomuser.me/api/portraits/women/30.jpg" },

  // 8 new ones
  { id: 13, name: "Rudra Sen", profession: "Painter", rating: 4.5, rate: 700, desc: "Home & office painting expert with neat finishing.", location: "Delhi", skills: ["Interior Paint", "Texture"], isVerified: true, image: "https://randomuser.me/api/portraits/men/17.jpg" },
  { id: 14, name: "Mahima Joshi", profession: "Content Writer", rating: 4.9, rate: 850, desc: "SEO blogs, business copy & engaging landing pages.", location: "Remote", skills: ["SEO", "Blogs"], isVerified: true, image: "https://randomuser.me/api/portraits/women/18.jpg" },
  { id: 15, name: "Nikhil Chatur", profession: "Fitness Trainer", rating: 4.8, rate: 1000, desc: "Personal trainer for physical transformation & strength.", location: "Mumbai", skills: ["Weight Loss", "Strength"], isVerified: true, image: "https://randomuser.me/api/portraits/men/19.jpg" },
  { id: 16, name: "Zoya Khan", profession: "Yoga Instructor", rating: 4.7, rate: 750, desc: "Certified Yoga trainer improving posture & flexibility.", location: "Chennai", skills: ["Hatha Yoga", "Meditation"], isVerified: true, image: "https://randomuser.me/api/portraits/women/26.jpg" },
  { id: 17, name: "Rohan Yadav", profession: "Driver", rating: 4.5, rate: 600, desc: "Trained professional driver for outstation travel.", location: "Hyderabad", skills: ["Long Route", "Safety"], isVerified: false, image: "https://randomuser.me/api/portraits/men/15.jpg" },
  { id: 18, name: "Sakshi Dubey", profession: "House Maid", rating: 4.3, rate: 350, desc: "Regular house cleaning & kitchen assistance.", location: "Delhi", skills: ["Cleaning", "Cooking"], isVerified: false, image: "https://randomuser.me/api/portraits/women/27.jpg" },
  { id: 19, name: "Dev Sharma", profession: "Tile Installer", rating: 4.6, rate: 900, desc: "Floor & wall tiling with precision finishing.", location: "Hyderabad", skills: ["Tiling", "Bathroom"], isVerified: true, image: "https://randomuser.me/api/portraits/men/18.jpg" },
  { id: 20, name: "Mehul Gandhi", profession: "Laptop Technician", rating: 4.8, rate: 850, desc: "Laptop repairs, SSD upgrades, OS formatting.", location: "Bangalore", skills: ["Hardware Repair", "Software Fix"], isVerified: true, image: "https://randomuser.me/api/portraits/men/29.jpg" },
];

// Always return static + user-added
export function getAllProfessionals() {
  const savedData = localStorage.getItem("newProfessionals");
  const newProfessionals = savedData ? JSON.parse(savedData) : [];

  const formatted = newProfessionals.map(p => ({
    ...p,
    location: p.location || "Local",
    skills: p.skills || [p.profession],
    isVerified: p.isVerified !== undefined ? p.isVerified : true,
  }));

  return [...staticProfessionalsData, ...formatted];
}

export const availableCities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Remote"];
