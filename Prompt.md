# 🚨 IMPORTANT - READ BEFORE GENERATING ANY CODE

This prompt depends on THREE attached files.

## Attached Files

### 1. HerLytics Summary.docx
This document is the PRIMARY SOURCE OF TRUTH.

It contains:
- Project Vision
- Problem Statement
- Complete Functional Requirements
- Feature Specifications
- User Flow
- Technology Stack
- Database Expectations
- AI Prediction Requirements
- Dashboard Requirements
- Future Scope
- Design Philosophy
- Medical Disclaimer
- Deployment Stack

Read the ENTIRE document before generating any code.

Do NOT skip any section.

Every feature described in the summary must be implemented.

If there is any conflict between this prompt and the summary, **the summary document takes priority.**

---

### 2. HerLytics Logo

Use this logo throughout the application.

It defines the application's branding.

Follow its:

- Colors
- Identity
- Typography style
- Overall aesthetic

Do not redesign the branding.

---

### 3. HerLytics UI Design

These UI screens define the complete design language of the application.

Use them as the design reference for ALL pages.

Match as closely as possible:

- Layout
- Spacing
- Colors
- Cards
- Typography
- Buttons
- Navigation
- Forms
- Icons
- Illustrations
- Animations
- Dashboard
- Questionnaire
- Result Screen
- Recommendation Screen

If a page is not shown, create it using the exact same design language.

Do NOT redesign the interface.

Maintain complete consistency across the application.

---

# Development Rule

Before writing any code:

1. Read the complete Summary document.
2. Analyze every attached UI screen.
3. Analyze the logo.
4. Build a mental model of the entire product.
5. Then begin implementation.

Do not generate placeholder pages.

Do not skip features.

Do not simplify functionality.

The final output should be a production-ready startup-quality application.
ROLE
You are a Principal Software Architect, Senior Full Stack Engineer, Senior UI/UX Designer, AI Engineer, DevOps Engineer, Security Engineer, Database Architect, and Product Designer with 20+ years of experience.
Your responsibility is to build a production-ready AI-powered women's wellness platform called HerLytics.
This is NOT a prototype.
This is NOT a hackathon demo.
This should be designed exactly like a startup MVP that is scalable for thousands of users.
________________________________________
IMPORTANT
I have attached THREE FILES.
1.	HerLytics Summary.docx 
2.	HerLytics Logo 
3.	HerLytics Mobile UI Design 
The Summary document is the source of truth.
Do NOT skip any feature described in the document.
The UI images define the visual language.
The logo defines the branding.
Use all three files throughout development.
Do NOT redesign the application.
Do NOT invent another theme.
Follow the provided UI as closely as possible.
________________________________________
PROJECT GOAL
Build the complete HerLytics platform exactly as described in the attached Summary.
The application should feel premium, elegant, modern and trustworthy.
It should look like a professionally designed health application ready for App Store and Play Store.
________________________________________
BRANDING
Use the attached logo everywhere appropriate.
Brand Name
HerLytics
Tagline
Predict. Prevent. Empower.
Primary Colors
Soft Purple
Lavender
Pink
White
Light backgrounds
Rounded cards
Soft shadows
Minimalistic interface
No dark heavy colors.
The application should feel warm and calming.
________________________________________
DESIGN REQUIREMENTS
Use the attached UI screens as the design reference.
Replicate
Typography
Spacing
Card layouts
Rounded buttons
Progress circles
Questionnaire
Charts
Result page
Dashboard
Navigation
Color palette
Animations
Illustrations
Component hierarchy
Maintain consistency throughout the application.
Every screen that is not included in the UI images should follow the exact same design system.
________________________________________
RESPONSIVENESS
The application must support
Desktop
Tablet
Mobile
Everything should remain pixel perfect.
________________________________________
TECH STACK
Frontend
React
Vite
TypeScript
Tailwind CSS
Shadcn UI
React Router
React Hook Form
Zod
Axios
Framer Motion
Recharts
Lucide Icons
Backend
Spring Boot
Java
Spring Security
JWT Authentication
Hibernate
REST API
Validation
Swagger
AI Service
Python
FastAPI
Scikit-Learn
Machine Learning model
Database
PostgreSQL
Neon PostgreSQL
Cloudinary
Image storage
Deployment Ready
Frontend
Vercel
Backend
Render
________________________________________
AUTHENTICATION
Implement
Login
Register
Forgot Password
Reset Password
JWT Authentication
Google Login
Protected Routes
Refresh Token
Role Based Access
User Profile
________________________________________
USER FLOW
Landing Page
↓
Register/Login
↓
Complete Profile
↓
PCOS Assessment
↓
Prediction
↓
Dashboard
↓
Lifestyle Tracking
↓
Recommendations
↓
Recipes
↓
Diet Planner
↓
Health Articles
↓
Profile
________________________________________
LANDING PAGE
Create an elegant landing page.
Include
Hero Section
Features
Benefits
AI Prediction
Testimonials
Call To Action
FAQ
Footer
Animations
Responsive Design
________________________________________
DASHBOARD
Dashboard should include
Wellness Score
Risk Score
Cycle Summary
Recent Prediction
Water Intake
Weight
BMI
Sleep
Exercise
Mood
Quick Actions
Charts
Recent Activities
Recommendations
________________________________________
PCOS QUESTIONNAIRE
Create approximately 25 professionally designed questions.
Include
Age
Height
Weight
BMI
Cycle Length
Regularity
Heavy Bleeding
Acne
Hair Loss
Facial Hair
Mood
Weight Gain
Exercise
Stress
Sleep
Water Intake
Sugar Consumption
Insulin Resistance
Family History
Lifestyle
Physical Activity
Medication
Medical History
Symptoms
Other Health Questions
Use progress indicators.
Allow Previous and Next.
Auto-save progress.
________________________________________
AI PREDICTION
Integrate with FastAPI.
The API returns
Risk Percentage
Confidence Score
Risk Category
Health Explanation
Recommendations
Important Disclaimer
Low Risk
Moderate Risk
High Risk
________________________________________
RESULT PAGE
Exactly like the attached UI.
Show
Circular Progress
Risk %
Explanation
Recommendations
Health Tips
Buttons
View Details
Download Report
Retake Assessment
________________________________________
DETAILED INSIGHTS
Explain every important symptom.
Show
Risk Factors
Severity
Health Explanation
Lifestyle Advice
Medical Disclaimer
________________________________________
PERSONALIZED RECOMMENDATIONS
Generate recommendations based on
BMI
Lifestyle
Stress
Exercise
Sleep
Water Intake
Symptoms
Risk Level
Include
Diet
Exercise
Sleep
Hydration
Stress
Medical Consultation
Lifestyle Improvements
________________________________________
DIET PLANNER
Generate meal plans.
Include
Breakfast
Lunch
Dinner
Snacks
Calories
Protein
Carbs
Fat
Filters
Vegetarian
Vegan
Low Carb
High Protein
PCOS Friendly
________________________________________
RECIPE LIBRARY
Recipe Cards
Images
Cooking Time
Nutrition
Difficulty
Save Recipe
Bookmark
Search
Filter
Favorites
________________________________________
HEALTHY FOOD FINDER
Instead of ordering food
Generate healthier alternatives.
Provide
Food Name
Reason
Nutrition
Search Button
Redirect to Swiggy/Zomato search
Do NOT integrate delivery APIs.
________________________________________
MENSTRUAL TRACKER
Track
Cycle
Periods
Symptoms
Mood
Ovulation
Fertility Window
Calendar
Reminders
________________________________________
LIFESTYLE TRACKING
Track
Water
Sleep
Exercise
Mood
Weight
BMI
Daily Goals
Weekly Charts
Monthly Charts
________________________________________
HEALTH INSIGHTS
Transform data into understandable language.
Never display raw numbers only.
Explain
Why
What it means
How to improve
________________________________________
EDUCATION HUB
Build searchable articles.
Categories
PCOS
Nutrition
Hormones
Exercise
Stress
Mental Health
Women's Health
Bookmarks
Reading Progress
________________________________________
USER PROFILE
Personal Information
Medical History
Health Goals
Saved Recipes
Prediction History
Preferences
Settings
________________________________________
DATABASE DESIGN
Create normalized PostgreSQL schema.
Include
Users
Assessments
Predictions
Symptoms
Lifestyle Logs
Recipes
Meal Plans
Bookmarks
Articles
Notifications
Refresh Tokens
Audit Logs
________________________________________
API DESIGN
Build REST APIs.
Proper validation.
Proper error handling.
Swagger Documentation.
DTOs.
Pagination.
Filtering.
Sorting.
Searching.
________________________________________
AI MODEL
Prepare architecture for future training.
Model should be modular.
Easy replacement.
Prediction endpoint.
Confidence endpoint.
Recommendation engine.
________________________________________
SECURITY
JWT
Password Encryption
Spring Security
Rate Limiting
Input Validation
SQL Injection Protection
XSS Protection
CSRF Protection
Secure Headers
Environment Variables
Role Authorization
________________________________________
PERFORMANCE
Lazy Loading
Code Splitting
Caching
Optimized Queries
Reusable Components
Minimal Re-rendering
Image Optimization
________________________________________
ANIMATIONS
Use Framer Motion.
Subtle animations only.
Smooth transitions.
Page transitions.
Hover effects.
Loading animations.
Skeleton screens.
________________________________________
ACCESSIBILITY
ARIA labels
Keyboard Navigation
Contrast Compliance
Responsive Fonts
Screen Reader Friendly
________________________________________
PROJECT STRUCTURE
Create a scalable enterprise architecture.
Frontend
components/
pages/
layouts/
hooks/
services/
contexts/
types/
utils/
assets/
Backend
controller/
service/
repository/
entity/
dto/
config/
security/
exception/
validation/
AI
app/
model/
predict/
training/
utils/
________________________________________
CODE QUALITY
Follow SOLID principles.
Clean Architecture.
Reusable components.
No duplicated code.
No hardcoded values.
No inline styles.
Strong typing.
Meaningful naming.
Comments only where necessary.
________________________________________
DELIVERABLES
Generate
Complete Frontend
Complete Backend
Complete FastAPI AI Service
Database Schema
API Documentation
Environment Files
Docker Configuration
README
Installation Guide
Deployment Guide
Testing Instructions
Folder Structure
________________________________________
NON-NEGOTIABLE RULES
•	Do not simplify features. 
•	Do not leave placeholders or TODOs. 
•	Do not use dummy components where production code is expected. 
•	Do not hardcode health recommendations; generate them dynamically based on assessment data. 
•	Ensure all UI follows the attached design system. 
•	Use the attached logo consistently across the application. 
•	Follow the attached project summary as the functional specification for every module. 
•	The final result should be production-ready, scalable, secure, responsive, and maintainable. 
# Implementation Strategy

Do NOT attempt to generate the entire project in one response.

Instead, work in phases.

Phase 1
- Project architecture
- Folder structure
- Database schema
- API design
- UI component design system

Phase 2
- Authentication
- User management
- Landing page
- Dashboard

Phase 3
- PCOS Assessment
- AI Integration
- Prediction Engine

Phase 4
- Lifestyle Tracking
- Diet Planner
- Recipe Library
- Healthy Food Finder

Phase 5
- Menstrual Tracker
- Health Insights
- Educational Hub
- Profile

Phase 6
- Testing
- Security
- Performance Optimization
- Deployment
- Docker
- CI/CD

After completing each phase, verify that all requirements from the Summary document have been implemented before proceeding to the next phase.

Never remove existing functionality while implementing new features.

Maintain clean architecture, modularity, and production-quality code throughout the project.
