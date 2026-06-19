const photos = [
  { src: "Фото и видео/IMG_20260619_152122.png", alt: "Фото санатория НИВА 1" },
  { src: "Фото и видео/IMG_20260619_152125.png", alt: "Фото санатория НИВА 2" },
  { src: "Фото и видео/IMG_20260619_152129.png", alt: "Фото санатория НИВА 3" },
  { src: "Фото и видео/IMG_20260619_152132.png", alt: "Фото санатория НИВА 4" },
  { src: "Фото и видео/IMG_20260619_152135.png", alt: "Фото санатория НИВА 5" },
  { src: "Фото и видео/IMG_20260619_152137.png", alt: "Фото санатория НИВА 6" },
  { src: "Фото и видео/IMG_20260619_152139.png", alt: "Фото санатория НИВА 7" },
  { src: "Фото и видео/IMG_20260619_152146.png", alt: "Фото санатория НИВА 8" },
  { src: "Фото и видео/IMG_20260619_152148.png", alt: "Фото санатория НИВА 9" },
  { src: "Фото и видео/IMG_20260619_152150.png", alt: "Фото санатория НИВА 10" },
  { src: "Фото и видео/IMG_20260619_152152.png", alt: "Фото санатория НИВА 11" },
  { src: "Фото и видео/IMG_20260619_152154.png", alt: "Фото санатория НИВА 12" },
  { src: "Фото и видео/IMG_20260619_152156.png", alt: "Фото санатория НИВА 13" },
  { src: "Фото и видео/IMG_20260619_152158.png", alt: "Фото санатория НИВА 14" },
  { src: "Фото и видео/IMG_20260619_152200.png", alt: "Фото санатория НИВА 15" },
];

let currentIndex = 0;
let touchStartX = 0;

const mainPhoto = document.querySelector("#mainPhoto");
const photoCounter = document.querySelector("#photoCounter");
const thumbnails = document.querySelector("#thumbnails");
const prevButton = document.querySelector(".slider-prev");
const nextButton = document.querySelector(".slider-next");
const openLightboxButton = document.querySelector(".open-lightbox");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

function showPhoto(index) {
  currentIndex = (index + photos.length) % photos.length;
  const photo = photos[currentIndex];

  mainPhoto.classList.add("is-changing");

  window.setTimeout(() => {
    mainPhoto.src = photo.src;
    mainPhoto.alt = photo.alt;
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    photoCounter.textContent = `${currentIndex + 1} / ${photos.length}`;

    document.querySelectorAll(".thumbnail").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === currentIndex);
      button.setAttribute("aria-selected", buttonIndex === currentIndex ? "true" : "false");
    });

    mainPhoto.classList.remove("is-changing");
  }, 120);
}

function nextPhoto() {
  showPhoto(currentIndex + 1);
}

function prevPhoto() {
  showPhoto(currentIndex - 1);
}

function openLightbox() {
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  openLightboxButton.focus();
}

photos.forEach((photo, index) => {
  const button = document.createElement("button");
  button.className = "thumbnail";
  button.type = "button";
  button.setAttribute("aria-label", `Показать фото ${index + 1}`);
  button.setAttribute("aria-selected", index === 0 ? "true" : "false");

  const image = document.createElement("img");
  image.src = photo.src;
  image.alt = photo.alt;
  image.loading = "lazy";

  button.append(image);
  button.addEventListener("click", () => showPhoto(index));
  thumbnails.append(button);
});

prevButton.addEventListener("click", prevPhoto);
nextButton.addEventListener("click", nextPhoto);
openLightboxButton.addEventListener("click", openLightbox);
mainPhoto.addEventListener("click", openLightbox);
lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", prevPhoto);
lightboxNext.addEventListener("click", nextPhoto);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

mainPhoto.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

mainPhoto.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].clientX;
  const distance = touchEndX - touchStartX;

  if (Math.abs(distance) > 50) {
    distance < 0 ? nextPhoto() : prevPhoto();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextPhoto();
  }

  if (event.key === "ArrowLeft") {
    prevPhoto();
  }

  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
showPhoto(0);