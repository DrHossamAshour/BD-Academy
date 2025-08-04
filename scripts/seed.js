// Simple seed script for development
// Run with: node scripts/seed.js (after setting up environment variables)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// This would connect to MongoDB and create sample data
const seedData = {
  sampleCourses: [
    {
      title: "Performance Marketing Mastery",
      description: "Master performance marketing strategies and increase your digital marketing ROI with advanced techniques",
      image: "https://ext.same-assets.com/1352620099/2409258185.webp",
      price: 29,
      originalPrice: 99,
      category: "Marketing",
      level: "Intermediate",
      duration: "5 hours",
      features: [
        "Lifetime access to course content",
        "45 video lessons and resources",
        "Certificate of completion",
        "Mobile and desktop access",
        "Download resources for offline viewing",
        "Direct access to instructor"
      ]
    },
    {
      title: "Visual Content Creation",
      description: "Create stunning visual content for social media and marketing campaigns using professional tools",
      image: "https://ext.same-assets.com/1352620099/3921090386.webp",
      price: 29,
      originalPrice: 79,
      category: "Design",
      level: "Beginner",
      duration: "3 hours",
      features: [
        "Lifetime access to course content",
        "25 video lessons and resources",
        "Certificate of completion",
        "Mobile and desktop access",
        "Design templates and resources",
        "Direct access to instructor"
      ]
    }
  ],
  
  sampleLessons: [
    {
      title: "Introduction to Performance Marketing",
      description: "Learn the fundamentals of performance marketing",
      order: 1,
      duration: "15 minutes",
      vimeoUrl: "https://player.vimeo.com/video/1070508363",
      vimeoVideoId: "1070508363",
      isPreview: true
    },
    {
      title: "Setting Up Google Analytics",
      description: "Configure Google Analytics for tracking",
      order: 2,
      duration: "20 minutes", 
      vimeoUrl: "https://player.vimeo.com/video/1070508364",
      vimeoVideoId: "1070508364",
      isPreview: false
    }
  ],
  
  sampleUsers: [
    {
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      password: "password123",
      role: "instructor",
      avatar: "https://ext.same-assets.com/1352620099/2098704192.webp"
    },
    {
      name: "Sarah Johnson", 
      email: "sarah@example.com",
      password: "password123",
      role: "instructor",
      avatar: "https://ext.same-assets.com/1352620099/2467202758.webp"
    },
    {
      name: "John Student",
      email: "student@example.com", 
      password: "password123",
      role: "student"
    }
  ]
};

console.log('Sample seed data structure created.');
console.log('To implement actual seeding:');
console.log('1. Set up your environment variables');
console.log('2. Connect to MongoDB');
console.log('3. Create users, courses, and lessons using the models');
console.log('4. Link lessons to courses and courses to instructors');

module.exports = seedData;