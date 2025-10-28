export const constant = {
    REACT_APP_API_BASE_URL: `${process.env.NODE_ENV === "development" ? 'https://www.gatewayabroadeducations.com' : 'https://www.gatewayabroadeducations.com'}/api/v1`,
    REACT_APP_URL: `${process.env.NODE_ENV === "development" ? 'https://www.gatewayabroadeducations.com' : 'https://www.gatewayabroadeducations.com'}`,
    SOCIAL_MEDIA_LINK: {
        FB: "https://www.facebook.com/sharer/sharer.php",
        LINKEDIN: "https://www.linkedin.com/sharing/share-offsite/?url=",
        TWITTER: "http://twitter.com/share",
    },
    COURSE_MENU: [
        {
            name: "All",
            value: "All"
        },
        {
            name: "GMAT",
            value: "GMAT"
        },
        {
            name: "IELTS",
            value: "IELTS"
        },
        {
            name: "TOEFL",
            value: "TOEFL"
        },
        {
            name: "GRE",
            value: "GRE"
        },
        {
            name: "PTE",
            value: "PTE"
        },
        {
            name: "SAT",
            value: "SAT"
        },
        {
            name: "SPOKEN ENGLISH",
            value: "SPOKEN ENGLISH"
        },
        {
            name: "UK",
            value: "UK"
        },
        {
            name: "USA",
            value: "USA"
        },
        {
            name: "IRELAND",
            value: "IRELAND"
        },
        {
            name: "CANADA",
            value: "CANADA"
        },
        {
            name: "DUBAI",
            value: "DUBAI"
        },
        {
            name: "AUSTRALIA",
            value: "AUSTRALIA"
        },
        {
            name: "NEW ZEALAND",
            value: "NEW ZEALAND"
        },
        {
            name: "VISA",
            value: "VISA"
        },
        {
            name: "OTHER",
            value: "OTHER"
        }
    ],
    TEST_PREPARATION: [
        {
            text1: 'Experienced and',
            text2: 'qualified coaches',
            imageName: 'coaching-services-img1.svg'
        },
        {
            text1: 'Personalized',
            text2: 'attention',
            imageName: 'coaching-services-img2.svg'
        },
        {
            text1: 'Proven track record',
            text2: 'of success',
            imageName: 'coaching-services-img3.svg'
        },
        {
            text1: 'Comprehensive study',
            text2: 'materials',
            imageName: 'coaching-services-img4.svg'
        },
        {
            text1: 'Flexible scheduling',
            text2: '',
            imageName: 'coaching-services-img5.svg'
        },
        {
            text1: 'Positive student',
            text2: 'testimonials',
            imageName: 'coaching-services-img6.svg'
        },
        {
            text1: 'Regular progress',
            text2: 'tracking',
            imageName: 'coaching-services-img7.svg'
        },
        {
            text1: 'Affordable fees',
            text2: '',
            imageName: 'coaching-services-img8.svg'
        }
    ],
    ADMIN_SIDE_BAR: [
        {
            "title": "Visit Site",
            "icon": "fa-tachometer-alt",
            "path": "/",
            "isActive": true
        },
        {
            "title": "PAGES",
            "isHeader": true
        },
        {
            "title": "Landing Page Form",
            "icon": "fa-landing-page",
            "path": "/admin/landing-page-data"
        },
        {
            "title": "Register User List",
            "icon": "fa-landing-page",
            "path": "/admin/register-user-list"
        },
        {
            "title": "Home",
            "icon": "fa-home",
            "path": "/admin/main-page"
        },
        {
            "title": "Spoken English",
            "icon": "fa-home",
            "path": "/admin/spoken-english"
        },
        {
            "title": "About",
            "icon": "fa-info-circle",
            "path": "/admin/about"
        },
        {
            "title": "Blog",
            "icon": "fa-rss",
            "path": "/admin/blog"
        },
        {
            "title": "Contact Form",
            "icon": "fa-address-book",
            "path": "/admin/contact-form"
        },
        {
            "title": "Contact Page",
            "icon": "fa-circle",
            "path": "/admin/contact"
        },
        {
            "title": "Register Form",
            "icon": "fa-circle",
            "path": "/admin/register-form"
        },
        {
            "title": "Contact Detail",
            "icon": "fa-circle",
            "path": "/admin/contact-detail"
        },
        {
            "title": "Career Page",
            "icon": "fa-circle",
            "path": "/admin/career"
        },
        {
            "title": "Job",
            "icon": "fa-circle",
            "path": "/admin/all-job"
        },
        {
            "title": "Resume",
            "icon": "fa-circle",
            "path": "/admin/resume"
        },
        {
            "title": "Partner",
            "icon": "fa-circle",
            "path": "/admin/partner"
        },
        {
            "title": "Courses",
            "icon": "fa-graduation-cap",
            "path": "/admin/courses"
        },
        {
            "title": "MODULE",
            "isHeader": true
        },
        {
            "title": "Testimonial",
            "icon": "fa-quote-left",
            "path": "/admin/testimonial"
        },
        {
            "title": "FAQ",
            "icon": "fa-question-circle",
            "path": "/admin/faq"
        },
        {
            "title": "Member",
            "icon": "fa-user-circle-o",
            "path": "/admin/member"
        },
        {
            "title": "Student",
            "icon": "fa-question-circle",
            "path": "/admin/students"
        },
        {
            "title": "Office",
            "icon": "fa-question-circle",
            "path": "/admin/office"
        },
        {
            "title": "NewsLetter",
            "icon": "fa-question-circle",
            "path": "/admin/newsletter"
        },
        {
            "title": "Student Video",
            "icon": "fa-circle",
            "path": "/admin/studentvideo"
        },
        {
            "title": "Gallery",
            "icon": "fa-circle",
            "path": "/admin/gellary"
        }
    ],
};