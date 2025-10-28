'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useAsync from '@/hooks/useAsync'; // Adjust path as needed
import PageServices from '@/services/PageServices'; // Adjust path as needed
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { constant } from '@/constant/index.constant'; // Adjust path as needed

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('photos'); // Default to 'photos'

  const { data: photoData } = useAsync(PageServices.getPhoto);
  const { data: videoData } = useAsync(PageServices.getYoutubeVideo);

  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSlides, setLightboxSlides] = useState([]);

  useEffect(() => {
    if (photoData?.data?.media) {
      setPhotos(photoData.data.media);
    }
    if (videoData?.data?.media) {
      setVideos(videoData.data.media);
    }
  }, [photoData, videoData]);

  const openImageLightbox = (index) => {
    const slides = photos.map(photo => ({
      type: "image",
      src: `${constant.REACT_APP_URL}/uploads/${photo.mediaLink}`,
      alt: photo.altText || `Gallery Image ${photo._id || photo.id}`,
    }));
    setLightboxSlides(slides);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };


  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      y: -8,
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}

      <section className="hero-gradient">
        <div className="px-4 min-h-[40vh]">
          <div className="text-center m-auto max-w-4xl pt-32 pb-8">
            <h1 className="text-3xl lg:text-[2.6rem] font-bold text-gray-900 mb-6">
              Our <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
             Explore moments from our events, student achievements, and learning environment.
            </p>
          </div>
        </div>
      </section>
      {/* Navigation Tabs (State-based) */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-3 px-1 text-center border-b-2 font-medium transition-colors duration-200 focus:outline-none ${activeTab === 'photos'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              aria-current={activeTab === 'photos' ? 'page' : undefined}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-3 px-1 text-center border-b-2 font-medium transition-colors duration-200 focus:outline-none ${activeTab === 'videos'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              aria-current={activeTab === 'videos' ? 'page' : undefined}
            >
              Videos
            </button>
          </nav>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="container mx-auto px-4 py-8">
        {/* --- Photo Gallery Section --- */}
        {activeTab === 'photos' && (
          <motion.div
            className="photo-gallery-section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {photos.map((photo, index) => (
                    <motion.div
                      key={photo._id || photo.id || index}
                      className="aspect-square"
                      variants={itemVariants}
                      whileHover="hover"
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <div
                        className="gallery-item relative overflow-hidden rounded-xl shadow-md cursor-pointer bg-gray-200 h-full w-full"
                        onClick={() => openImageLightbox(index)}
                      >
                        <Image
                          src={`${constant.REACT_APP_URL}/uploads/${photo.mediaLink}`}
                          alt={photo.altText || `Gallery Image ${photo._id || photo.id}`}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          style={{ objectFit: 'cover' }}
                          className="transition-transform duration-500 ease-in-out transform"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                          <span className="text-white text-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 transform translate-y-2 hover:translate-y-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Photos Found</h3>
                <p className="text-gray-500">Check back later for updates.</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* --- Video Gallery Section (Using iframe embeds) --- */}
        {activeTab === 'videos' && (
          <motion.div
            className="video-gallery-section"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {videos.map((video, index) => {
                    let videoId = video.mediaLink;
                    let embedUrl = '';
                    let thumbnailUrl = '';

                    if (videoId) {
                      try {
                        if (videoId.includes('youtube.com/watch?v=')) {
                          const url = new URL(videoId);
                          videoId = url.searchParams.get('v');
                        } else if (videoId.includes('youtu.be/')) {
                          const urlParts = videoId.split('youtu.be/');
                          if (urlParts.length > 1) {
                            videoId = urlParts[1].split('?')[0];
                          }
                        }
                      } catch (e) {
                        console.error("Error parsing video URL:", video.mediaLink, e);
                      }

                      if (videoId) {
                        embedUrl = `https://www.youtube.com/embed/${videoId}`; // For iframe src
                      }
                    }
                    // --- End YouTube Handling ---

                    return (
                      <motion.div
                        key={video._id || video.id || index}
                        className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl"
                        variants={itemVariants}
                        whileHover="hover"
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                      >
                        <div
                          className="relative aspect-video cursor-pointer group"
                        >
                          {embedUrl ? (
                            <iframe
                              src={embedUrl}
                              title={`YouTube video: ${video.title || `Video ${index + 1}`}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="w-full h-full absolute inset-0" // Fill the parent container
                              loading="lazy"
                            ></iframe>
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Video Info Card Below Iframe */}
                        <div className="p-4">
                          {video.title ? (
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{video.title}</h3>
                          ) : (
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div> // Skeleton loader
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Videos Found</h3>
                <p className="text-gray-500">Check back later for updates.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              slides={lightboxSlides}
              index={lightboxIndex}
              plugins={[Zoom, Captions, Slideshow, Fullscreen, Thumbnails]} // <--- Video plugin included
              carousel={{
                preload: 2,
                finite: false, // Enable infinite scrolling/sliding
              }}
              animation={{
                fade: 1300,
                swipe: 800,
              }}
              zoom={{
                maxZoomPixelRatio: 3,
                zoomInMultiplier: 2,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;