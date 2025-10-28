import requests from "./httpService";

const PageServices = {



    // About Page 

    getAboutPageById: async (id) => {
        return requests.get(`/page/658bfd5ded8b621f3d39eae8`);
    },

    updateAboutPageById: async (body) => {
        return requests.patch(`/page/658bfd5ded8b621f3d39eae8`, body);
    },

    // Contact Page 

    getContactPageById: async (id) => {
        return requests.get(`/page/65af5de67fbc53a5e549a167`);
    },

    updateContactPageById: async (body) => {
        return requests.patch(`/page/65af5de67fbc53a5e549a167`, body);
    },


    //career Page 

    getCareerPageById: async (id) => {
        return requests.get(`/page/658bfdc43a031ae62e352c6d`);
    },

    updateCareerPageById: async (body) => {
        return requests.patch(`/page/658bfdc43a031ae62e352c6d`, body);
    },


    // Blog Page 

    getBlogPageById: async (id) => {
        return requests.get(`/page/65af62437fbc53a5e549a19c`);
    },

    updateBlogPageById: async (body) => {
        return requests.patch(`/page/65af62437fbc53a5e549a19c`, body);
    },

    // Home Page 

    getHomePageById: async (id) => {
        return requests.get(`/page/658bff0f362611fcbf113762`);
    },

    updateHomePageById: async (body) => {
        return requests.patch(`/page/658bff0f362611fcbf113762`, body);
    },

    // form data ........................................................

    //Contact Form data 

    createForme: async (body) => {

        return await requests.post(`/form`, body)
    },
    getPartnerFormData: async () => {
        return await requests.get(`/form?type=partner`);
    },
    getFormData: async () => {
        return await requests.get(`/form?type=contact`);
    },

    getResumeData: async () => {
        return await requests.get(`/form?type=resume`);
    },
    getRegisterData: async () => {
        return await requests.get(`/form?type=register`);
    },

    getFormDataById: async (id) => {
        const res = await requests.get(`/form/${id}`);
        return res;
    },

    deleteFormeData: async (id) => {
        const res = await requests.delete(`/form/${id}`);
        return res;
    },
    // setting 

    getSettingData: async () => {
        return await requests.get(`/setting`);
    },

    updateSettingData: async (body) => {
        return await requests.patch(`/setting`, body);
    },

    // Jobe

    getJobData: async () => {
        return await requests.get(`/job`);
    },
    getJobDataById: async (id) => {
        return await requests.get(`/job/${id}`);
    },
    updateJobForm: async (id, body) => {
        return await requests.patch(`/job/${id}`, body);
    },
    createJobe: async (body) => {
        return await requests.post(`/job`, body);
    },
    userRegistration: async (body) => {
        return await requests.post(`/users/register`, body);
    },
    deleteJobData: async (id) => {
        return await requests.delete(`/job/${id}`);

    },

    // courses
    getCourse: async () => {
        return await requests.get(`/page?type=course`);
    },

    getCourseById: async (id) => {
        return await requests.get(`/page/${id}`);
    },

    getCourseByName: async (id) => {
        return await requests.get(`/page/course/${id}`);
    },

    updateCourse: async (id, body) => {
        return await requests.patch(`/page/${id}`, body);
    },
    delete: async (id) => {
        return await requests.get(`/page/${id}`);
    },

    // blog

    getBlogData: async ({ page, limit, category, search }) => {
        return await requests.get(`/blog/`, {
            params: {
                page,
                limit,
                category,
                search,
            }
        })
    },
    createBlog: async (body) => {
        return await requests.post(`/blog/`, body)
    },
    getBlogDataById: async (id) => {
        return await requests.get(`/blog/${id}`)
    },

    getBlogDataByIdForEdit: async (id) => {
        return await requests.get(`/edit-blog/${id}`)
    },

    deleteBlogDataById: async (id) => {
        return await requests.delete(`/edit-blog/${id}`)
    },
    updateBlogDataById: async (id, body) => {
        return await requests.patch(`/edit-blog/${id}`, body)
    },
    updateStudentById: async (id, formData) => {
        return requests.post(`/student/${id}`, formData)
    },
    // media
    getAllMedia: async (type) => {

        return await requests.get(`/media?type=${type ? type : 'all'}`)

    },

    getYoutubeVideo: async (type) => {

        return await requests.get(`/media?catogary=video`)

    },
    getPhoto: async (type) => {

        return await requests.get(`/media?catogary=image`)

    },

    AddMedia: async (body) => {

        return await requests.post(`/media`, body)

    },



    deleteMedia: async (id) => {

        return await requests.delete(`/media/${id}`)

    },
    addStudent: async (body) => {
        return await requests.post(`/student `, body)
    },

    getStudentById: async (id) => {
        return await requests.get(`/student/${id}`)
    },


    getTestimonial: async () => {
        return await requests.get(`/testimonial/`)
    },

    getTestimonialByCat: async (value) => {
        return await requests.get(`/testimonial?type=${value}`)
    },

    getTestimonialByid: async (id) => {
        return await requests.get(`/testimonial/${id}`)
    },

    updateTestimonialByid: async (id, formData) => {
        return await requests.patch(`/testimonial/${id}`, formData)
    },
    createTestimonial: async (body) => {
        return await requests.post(`/testimonial `, body)
    },
    deleteTestimonial: async (id) => {
        return await requests.delete(`/testimonial/${id} `)
    },


    // office route 

    getOffice: async () => {
        return await requests.get(`/office/`)
    },

    getOfficeByCat: async (value) => {
        return await requests.get(`/office?type=${value}`)
    },

    getOfficeByid: async (id) => {
        return await requests.get(`/office/${id}`)
    },

    updateOfficeByid: async (id, formData) => {
        return await requests.patch(`/office/${id}`, formData)
    },
    createOffice: async (body) => {
        return await requests.post(`/office `, body)
    },
    deleteOffice: async (id) => {
        return await requests.delete(`/office/${id} `)
    },

    getAllFaq: async (category) => {
        return await requests.get(`/faq`);
    },

    getAllFaqForFront: async (category) => {
        return await requests.get(`/faq?category=${category}`);
    },
    createFaq: async (body) => {
        return await requests.post(`/faq `, body)
    },
    deleteFaq: async (id) => {
        return await requests.delete(`/faq/${id} `)
    },

    getStudent: async () => {
        return await requests.get(`/student`)
    },
    getMember: async () => {
        return await requests.get(`/member`)
    },
    getOneMember: async (id) => {
        return await requests.get(`/member/${id}`)
    },
    deleteMember: async (id) => {
        return await requests.delete(`/member/${id}`)
    },
    addMember: async (body) => {
        return await requests.post(`/member`, body)
    },
    updateMember: async (id, body) => {
        return await requests.patch(`/member/${id}`, body)
    },
    getStudentSlider: async () => {
        return await requests.get(`/student?type=slider`)
    },
    getStudentHome: async () => {
        return await requests.get(`/student?type=home`)
    },

    deleteStudent: async (id) => {
        return await requests.delete(`/student/${id}`)
    },
    addEmail: async (body) => {
        return await requests.post(`/newsletter`, body)
    },
    getAllEmail: async () => {
        return await requests.get(`/newsletter`)
    },
    updateHomePageDetails: async (body) => {
        return await requests.post(`/home-edit?isEditable=${true}`, body)
    },

    updateSpokenEnglishDetails: async (body) => {
        return await requests.post(`/spoken-english-edit?isEditable=${true}`, body)
    },
    getHomePageDetails: async () => {
        return await requests.get(`/home-edit`)
    },
    getSpokenEnglishDetails: async () => {
        return await requests.get(`/spoken-english-edit`)
    },
    getAllPreferences: async () => {
        return await requests.get(`/preferences`)
    },
    newPreferences: async (data) => {
        return await requests.post(`/preferences`,data)
    },
    GetAllUserList: async () => {
        return await requests.get(`/users/all`)
    },

}

export default PageServices;