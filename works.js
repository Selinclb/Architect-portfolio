// AOS (Animate On Scroll) başlatma
AOS.init({
    duration: 800,
    once: true
});

// Strapi'den projeleri çekme
async function fetchProjects() {
    try {
        const response = await fetch('http://localhost:1337/api/works?populate=*');
        const data = await response.json();
        
        console.log('Strapi\'den gelen veri:', data);

        const projectsContainer = document.querySelector('.projects-container');
        if (!projectsContainer) {
            console.error('projects-container elementi bulunamadı');
            return;
        }
        
        projectsContainer.innerHTML = ''; // Mevcut içeriği temizle

        // Veri kontrolü
        if (!data || !data.data || !Array.isArray(data.data)) {
            console.error('Strapi\'den gelen veri formatı uygun değil:', data);
            projectsContainer.innerHTML = '<div class="error-message">Projeler yüklenirken bir hata oluştu.</div>';
            return;
        }

        if (data.data.length === 0) {
            projectsContainer.innerHTML = '<div class="no-projects">Henüz proje eklenmemiş.</div>';
            return;
        }

        // Hero section carousel'ını oluştur
        const heroSlider = document.querySelector('.hero-slider .swiper-wrapper');
        
        // Slider içeriğini oluştur
        let sliderHTML = '';
        data.data.forEach((project, index) => {
            if (project.Proje_Gorselleri && project.Proje_Gorselleri[0]) {
                sliderHTML += `
                    <div class="swiper-slide hero-slide" style="background-image: url(http://localhost:1337${project.Proje_Gorselleri[0].url})">
                        <div class="hero-content">
                            <div class="hero-text">
                                <div class="hero-number">${String(index + 1).padStart(2, '0')}</div>
                                <h2 class="hero-title">${project.Proje_Adi || 'İsimsiz Proje'}</h2>
                                <div class="hero-meta">
                                    <span class="hero-location">${project.Konum || 'Konum belirtilmemiş'}</span>
                                    <span class="hero-year">${project.Proje_yili || 'Yıl belirtilmemiş'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        heroSlider.innerHTML = sliderHTML;

        // Carousel'ı başlat
        const heroCarousel = new Swiper('.hero-slider', {
            slidesPerView: 1,
            effect: 'fade',
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction'
            }
        });

        // Projeleri listele
        data.data.forEach((project) => {
            console.log('Proje detayları:', project);
            
            // Veri kontrolü
            if (!project) {
                console.error('Proje verisi eksik:', project);
                return;
            }

            // Görsel kontrolü - eğer görsel yoksa varsayılan görsel kullan
            let imageUrl = 'https://via.placeholder.com/800x600?text=Görsel+Yok';
            if (project.Proje_Gorselleri && 
                Array.isArray(project.Proje_Gorselleri) && 
                project.Proje_Gorselleri[0] && 
                project.Proje_Gorselleri[0].url) {
                imageUrl = `http://localhost:1337${project.Proje_Gorselleri[0].url}`;
            }

            const projectHTML = `
                <section class="project-section">
                    <div class="project-number">${String(data.data.indexOf(project) + 1).padStart(2, '0')}</div>
                    <div class="project-image">
                        <img src="${imageUrl}" alt="${project.Proje_Adi || 'Proje Görseli'}">
                    </div>
                    <div class="project-info">
                        <h2>${project.Proje_Adi || 'İsimsiz Proje'}</h2>
                        <p>${project.Proje_Aciklamasi || 'Açıklama bulunmuyor.'}</p>
                        <div class="project-meta">
                            <span class="project-location">${project.Konum || 'Konum belirtilmemiş'}</span>
                            <span class="project-year">${project.Proje_yili || 'Yıl belirtilmemiş'}</span>
                        </div>
                    </div>
                </section>
            `;
            
            projectsContainer.innerHTML += projectHTML;
        });

        // Scroll animasyonunu ekle
        const projectSections = document.querySelectorAll('.project-section');
        const observerOptions = {
            root: null,
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        projectSections.forEach(section => {
            observer.observe(section);
        });

    } catch (error) {
        console.error('Projeler yüklenirken hata oluştu:', error);
        const projectsContainer = document.querySelector('.projects-container');
        if (projectsContainer) {
            projectsContainer.innerHTML = '<div class="error-message">Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>';
        }
    }
}

// Sayfa yüklendiğinde projeleri getir
document.addEventListener('DOMContentLoaded', fetchProjects);


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Ana sayfaya link ekle
document.addEventListener('DOMContentLoaded', () => {
    const worksLink = document.querySelector('.works');
    if (worksLink) {
        worksLink.innerHTML = '<a href="works.html" style="color: inherit; text-decoration: none;">WORKS</a>';
    }
}); 