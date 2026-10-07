/**
 * Stock imagery used by the marketing pages.
 *
 * These point at Unsplash so the site looks finished out of the box. To use your
 * own photos, upload them in the admin dashboard (any course image upload puts a
 * file in the `course-images` bucket) and paste the public URL here, or drop the
 * files into `frontend/public/images/` and use "/images/your-photo.jpg".
 *
 * Every hero keeps a solid background underneath, so the design still holds up
 * if an image is slow or blocked.
 */

export const unsplash = (id: string, width = 1920) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const HERO_IMAGES = {
  home: unsplash("1591123120675-6f7f1aae0e5b"),
  courses: unsplash("1503676260728-1c00da094a0b", 1600),
  studyAbroad: unsplash("1467269204594-9661b134dd2b", 1600),
  apprenticeships: unsplash("1581091226825-a6a2a5aee158", 1600),
  about: unsplash("1521737711867-e3b97375f902", 1600),
  blog: unsplash("1434030216411-0b793f4b4173", 1600),
};

/** Video files served straight from `frontend/public/videos/`. */
export const VIDEOS = {
  /** Campus tour clip shown as the featured post on the blog page. */
  germanAcademy: "/videos/german-academy-abroad.mp4",
};

/** Card images for the blog and the "Latest from WisdomLingo" home section. */
export const ARTICLE_IMAGES = {
  universities: unsplash("1562774053-701939374585", 900),
  language: unsplash("1434030216411-0b793f4b4173", 900),
  ausbildung: unsplash("1521737604893-d14cc237f11d", 900),
  visa: unsplash("1467269204594-9661b134dd2b", 900),
  campus: unsplash("1581091226825-a6a2a5aee158", 900),
  life: unsplash("1521737711867-e3b97375f902", 900),
};

/**
 * Our own photography, served from `frontend/public/images/blog/`. Unlike the
 * Unsplash entries above these are real WisdomLingo pictures, so they are the
 * ones to reach for first when a section needs to look like the actual academy.
 */
export const TEAM_PHOTOS = {
  /** Landscape - the only one wide enough to work as a page hero. */
  officeWide: "/images/blog/office-wide.jpg",
  /** Portrait at the counselling desk; used as the author headshot. */
  officePortrait: "/images/blog/office-portrait.jpg",
  formal: "/images/blog/portrait-formal.jpg",
  outdoor: "/images/blog/portrait-outdoor.jpg",
  evening: "/images/blog/portrait-evening.jpg",
};

/** Portraits for the home page testimonials. */
export const TESTIMONIAL_AVATARS = {
  sarah: unsplash("1494790108377-be9c29b29330", 160),
  ahmed: unsplash("1507003211169-0a1dd7228f2d", 160),
  elena: unsplash("1438761681033-6461ffad8d80", 160),
};
