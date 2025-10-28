import { createContext, useContext, useState, useEffect } from 'react';
import PageServices from '@/services/PageServices'; // adjust path
import axiosInstance from '@/services/axiosInstance';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
    const [user, setUser] = useState(null);
    const [drawer, setDrawer] = useState(false)
    const [authToken, setAuthToken] = useState(null);
    const [globalData, setGlobalData] = useState({
        aboutPage: null,
        homePage: null,
        course: null,
        testimonials: null,
        youtubeVideo: null,
        studentSlider: null,
        studentHome: null,
        teamMembers: null,
        careerPage: null,
        jobFormData: null,
        contactPage: null,
        contactSettings: null,
        faqData: null,
        courseSlider: null,
        spokenEnglish: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [
                    aboutPage,
                    homePage,
                    course,
                    testimonials,
                    youtubeVideo,
                    studentSlider,
                    studentHome,
                    teamMembers,
                    careerPage,
                    jobFormData,
                    contactPage,
                    contactSettings,
                    faqData,
                    courseSlider,
                    spokenEnglish,
                ] = await Promise.all([
                    PageServices.getAboutPageById().then(res => res?.data || null).catch(() => null),
                    PageServices.getHomePageDetails().then(res => res?.data || null).catch(() => null),
                    PageServices.getCourse().then(res => res?.data || null).catch(() => null),
                    PageServices.getTestimonial().then(res => res?.data || null).catch(() => null),
                    PageServices.getYoutubeVideo().then(res => res?.data || null).catch(() => null),
                    PageServices.getStudentSlider().then(res => res?.data || null).catch(() => null),
                    PageServices.getStudentHome().then(res => res?.data || null).catch(() => null),
                    PageServices.getMember().then(res => res?.data || null).catch(() => null),
                    PageServices.getCareerPageById().then(res => res?.data || null).catch(() => null),
                    PageServices.getJobData().then(res => res?.data || null).catch(() => null),
                    PageServices.getContactPageById().then(res => res?.data || null).catch(() => null),
                    PageServices.getSettingData().then(res => res?.data || null).catch(() => null),
                    PageServices.getOffice().then(res => res?.data || null).catch(() => null),
                    PageServices.getStudent().then(res => res?.data || null).catch(() => null),
                    PageServices.getSpokenEnglishDetails().then(res => res?.data || null).catch(() => null),
                ]);

                setGlobalData({
                    aboutPage,
                    homePage,
                    course,
                    testimonials,
                    youtubeVideo,
                    studentSlider,
                    studentHome,
                    teamMembers,
                    careerPage,
                    jobFormData,
                    contactPage,
                    contactSettings,
                    faqData,
                    courseSlider,
                    spokenEnglish,
                });
            } catch (err) {
                setError(err.message);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setLoading(true); // Start loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const userInfo = async () => {
        try {
            const response = await axiosInstance.get("auth/me", {
                withCredentials: true
            });
            setUser(response.data?.data)
        } catch (error) {

        }
    };

    const logout = async () => {
        try {
            const response = await axiosInstance.get("auth/logout");
            setUser(null)
            localStorage.removeItem("accessToken")
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    useEffect(() => {
        userInfo()
    }, [authToken])

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        setAuthToken(token);
        if (token) {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, [])

    return (
        <GlobalContext.Provider
            value={{
                user,
                userInfo,
                logout,
                ...globalData,
                loading,
                error, drawer, setDrawer
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}