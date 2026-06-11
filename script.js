document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME TOGGLE (DARK/LIGHT MODE)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const body = document.body;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    function setTheme(theme) {
        if (theme === 'light') {
            body.classList.replace('dark-theme', 'light-theme');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    }

    // ==========================================================================
    // SCROLL PROGRESS BAR & STICKY HEADER & BACK TO TOP
    // ==========================================================================
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Progress Bar Width
        scrollProgress.style.width = scrollPercent + '%';

        // Sticky Header
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back To Top Visibility
        if (scrollTop > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Back to top action
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // MOBILE NAVIGATION MENU
    // ==========================================================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================================================
    // PROJECTS CATEGORY FILTER
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');

            // Set active class on clicked button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter Projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    // Trigger fade in animation
                    setTimeout(() => {
                        card.classList.remove('fade-out');
                        card.classList.add('fade-in');
                    }, 50);
                } else {
                    card.classList.add('fade-out');
                    card.classList.remove('fade-in');
                    // Wait for fade out animation to finish before hiding display
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // ACTIVE NAVIGATION LINK HIGHLIGHT ON SCROLL
    // ==========================================================================
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Subtract offset to account for sticky navbar height (80px)
            if (window.scrollY >= (sectionTop - 120)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // CONTACT FORM SUBMISSION HANDLER
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable button during "sending" process
            submitBtn.disabled = true;
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

            // Simulate form submission to backend (API call)
            setTimeout(() => {
                submitBtn.innerHTML = 'Message Sent! <i class="fa-solid fa-check"></i>';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // green gradient
                
                // Clear input fields
                contactForm.reset();

                // Re-enable button after a delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.style.background = ''; // restore to CSS original
                }, 3000);
            }, 1500);
        });
    }

    // ==========================================================================
    // HERO TYPING TEXT ANIMATION EFFECT
    // ==========================================================================
    const words = ["Product Management", "Data Analytics", "Product Strategy"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpan = document.querySelector('.typing-text');

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typingSpeed = isDeleting ? 40 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at the end of the word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            // Pause before typing next word
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    // Start typewriter effect if elements exist
    if (typingSpan) {
        type();
    }

    // ==========================================================================
    // PROJECT ANALYSIS MODAL DATA & LOGIC
    // ==========================================================================
    const projectAnalyses = {
        topcv: {
            category: "UX Research / Job Matching",
            title: "TopCV Job Funnel Analysis",
            tech: ["Figma", "User Persona", "Funnel Mapping"],
            html: `
                <h4>1. TỔNG QUAN ĐỀ TÀI (OVERVIEW)</h4>
                <p>TopCV là nền tảng tuyển dụng hàng đầu Việt Nam. Tuy nhiên, quy trình từ khi tạo tài khoản đến khi nộp CV thành công vẫn còn nhiều điểm ma sát (friction). Mục tiêu của nghiên cứu là tối ưu hóa phễu chuyển đổi ứng tuyển của ứng viên.</p>
                
                <h4>2. ĐIỂM ĐAU CỦA NGƯỜI DÙNG (USER PAIN POINTS)</h4>
                <ul>
                    <li><strong>Quá trình tạo CV phức tạp:</strong> Trình tạo CV trên thiết bị di động khó thao tác, dẫn đến tỷ lệ bỏ ngang (drop-off) lên đến 25% ở bước lưu CV.</li>
                    <li><strong>Thuật toán gợi ý việc làm chưa tối ưu:</strong> Ứng viên nhận được nhiều gợi ý không đúng ngành nghề/mong muốn, tạo cảm giác mệt mỏi khi lướt tin tuyển dụng.</li>
                    <li><strong>Thiếu tính minh bạch:</strong> Ứng viên không rõ trạng thái CV của mình sau khi gửi (đã đọc hay chưa), gây tâm lý hoang mang.</li>
                </ul>

                <h4>3. GIẢI PHÁP ĐỀ XUẤT (PROPOSED SOLUTIONS)</h4>
                <ul>
                    <li><strong>Tích hợp AI CV Parser:</strong> Cho phép tải CV PDF có sẵn và tự động trích xuất thông tin điền vào form, rút ngắn thời gian tạo hồ sơ xuống dưới 1 phút.</li>
                    <li><strong>Cải tiến Gợi ý bằng Data:</strong> Sử dụng dữ liệu tìm kiếm và hành vi nhấp chuột gần nhất để cập nhật bảng tin gợi ý theo thời gian thực (Real-time).</li>
                    <li><strong>Bổ sung "Trạng thái ứng tuyển" (Application Tracker):</strong> Cung cấp tiến trình trực quan (Nộp hồ sơ -> CV đã xem -> Lịch hẹn phỏng vấn -> Kết quả) ngay trên màn hình cá nhân.</li>
                </ul>
                
                <h4>4. CHỈ SỐ ĐO LƯỜNG (METRICS TO TRACK)</h4>
                <p>Theo dõi tỷ lệ chuyển đổi qua các chỉ số: <strong>Conversion Rate (CV Creation to Application)</strong>, <strong>Time-to-Apply</strong>, và <strong>User Retention (DAU/MAU)</strong>.</p>
            `
        },
        study4: {
            category: "Product Strategy / Gamification",
            title: "Study4 User Retention Study",
            tech: ["Gamification", "Cohort Analysis", "Jira"],
            html: `
                <h4>1. TỔNG QUAN ĐỀ TÀI (OVERVIEW)</h4>
                <p>Study4 là nền tảng tự học IELTS/ngoại ngữ trực tuyến phổ biến. Vấn đề lớn nhất của các ứng dụng EdTech tự học là tỷ lệ hoàn thành khóa học thấp (<12%) do người dùng dễ mất động lực. Nghiên cứu này đề xuất giải pháp Gamification để cải thiện độ gắn kết.</p>
                
                <h4>2. ĐIỂM ĐAU CỦA NGƯỜI DÙNG (USER PAIN POINTS)</h4>
                <ul>
                    <li><strong>Nhanh chán nản:</strong> Học tiếng Anh một mình đòi hỏi tính tự giác cao. Không có cơ chế nhắc nhở thúc đẩy người dùng hàng ngày.</li>
                    <li><strong>Cảm giác học tập thụ động:</strong> Học viên chỉ làm bài tập trắc nghiệm và xem giải thích, thiếu sự tương tác xã hội hoặc thi đấu để kích thích tinh thần học tập.</li>
                </ul>

                <h4>3. GIẢI PHÁP ĐỀ XUẤT (PROPOSED SOLUTIONS)</h4>
                <ul>
                    <li><strong>Thiết lập Daily Streak & Điểm thưởng (Coins):</strong> Người dùng duy trì thói quen học mỗi ngày sẽ nhận được điểm thưởng. Điểm này có thể đổi lấy các bộ tài liệu độc quyền hoặc khóa học ngắn hạn.</li>
                    <li><strong>Đấu trường IELTS (Gamified Mock Tests):</strong> Tạo tính năng thi thử trực tuyến thời gian thực với bảng xếp hạng (Leaderboard) theo tuần giúp học viên cọ xát và cạnh tranh lành mạnh.</li>
                    <li><strong>Học nhóm (Study Rooms):</strong> Tích hợp phòng học ảo đếm ngược giờ (Pomodoro) để học viên cùng tham gia học tập, tăng tính cam kết xã hội.</li>
                </ul>
                
                <h4>4. CHỈ SỐ ĐO LƯỜNG (METRICS TO TRACK)</h4>
                <p>Đo lường sự thành công dựa trên: <strong>30-Day Retention Rate</strong>, <strong>Average Daily Study Time</strong>, và <strong>Course Completion Rate</strong>.</p>
            `
        },
        shopee: {
            category: "Conversion Rate Optimization (CRO)",
            title: "Shopee Cart Abandonment Analysis",
            tech: ["SQL", "A/B Testing", "Product Metrics"],
            html: `
                <h4>1. TỔNG QUAN ĐỀ TÀI (OVERVIEW)</h4>
                <p>Shopee là sàn TMĐT lớn nhất Việt Nam. Tuy nhiên, tỷ lệ bỏ giỏ hàng (Cart Abandonment) vẫn luôn là bài toán nhức nhối ở bước thanh toán cuối cùng. Nghiên cứu tập trung phân tích hành vi và tối ưu hóa luồng thanh toán.</p>
                
                <h4>2. ĐIỂM ĐAU CỦA NGƯỜI DÙNG (USER PAIN POINTS)</h4>
                <ul>
                    <li><strong>Phí ship bất ngờ (Hidden Shipping Cost):</strong> Người dùng chỉ biết phí ship thực tế sau khi nhấn vào trang thanh toán cuối cùng, dẫn đến quyết định hủy mua hàng tăng 30%.</li>
                    <li><strong>Ma sát khi áp dụng Voucher:</strong> Giao diện chọn voucher quá phức tạp. Người dùng gặp khó khăn khi cố gắng kết hợp Voucher miễn phí vận chuyển, Voucher của Shop và Xu Shopee cùng lúc.</li>
                </ul>

                <h4>3. GIẢI PHÁP ĐỀ XUẤT (PROPOSED SOLUTIONS)</h4>
                <ul>
                    <li><strong>Hiển thị phí ship ước tính sớm hơn:</strong> Hiển thị khoảng phí vận chuyển dự kiến ngay tại trang chi tiết sản phẩm và trang giỏ hàng dựa trên định vị vị trí người dùng.</li>
                    <li><strong>Tính năng "Auto-apply Best Vouchers":</strong> Nút bấm thông minh tự động tìm kiếm và áp dụng tổ hợp voucher có lợi nhất cho người dùng chỉ với 1 click.</li>
                    <li><strong>Rút ngắn luồng thanh toán (One-Click Checkout):</strong> Lưu thông tin thẻ và địa chỉ mặc định để người dùng có thể mua hàng siêu nhanh, hạn chế thời gian suy nghĩ dẫn đến hủy đơn.</li>
                </ul>
                
                <h4>4. CHỈ SỐ ĐO LƯỜNG (METRICS TO TRACK)</h4>
                <p>Các chỉ số chủ chốt bao gồm: <strong>Cart Abandonment Rate (CAR)</strong>, <strong>Checkout Conversion Rate</strong>, và <strong>Average Order Value (AOV)</strong>.</p>
            `
        }
    };

    // Modal Selectors
    const modal = document.getElementById('project-modal');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalTech = document.getElementById('modal-tech');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = modal.querySelector('.close-modal');

    // Open Modal Function
    document.querySelectorAll('.open-analysis-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const projectId = btn.getAttribute('data-project');
            const data = projectAnalyses[projectId];

            if (data) {
                modalCategory.textContent = data.category;
                modalTitle.textContent = data.title;
                
                // Clear and insert tech stack tags
                modalTech.innerHTML = '';
                data.tech.forEach(t => {
                    const span = document.createElement('span');
                    span.textContent = t;
                    modalTech.appendChild(span);
                });

                // Insert analysis body HTML
                modalBody.innerHTML = data.html;

                // Show modal
                modal.classList.add('open');
                body.style.overflow = 'hidden';
            }
        });
    });

    // Close Modal Function
    function closeModal() {
        modal.classList.remove('open');
        body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside content card
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
});
