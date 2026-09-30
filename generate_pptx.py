import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

os.makedirs('presentation', exist_ok=True)
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

blank_slide_layout = prs.slide_layouts[6]

# Theme Colors
BG_DARK = RGBColor(15, 23, 42)       # Slate 900
CARD_BG = RGBColor(30, 41, 59)       # Slate 800
CARD_BORDER = RGBColor(51, 65, 85)   # Slate 700
BLUE_ACCENT = RGBColor(37, 99, 235)  # Blue 600
CYAN_ACCENT = RGBColor(6, 182, 212)  # Cyan 500
GREEN_ACCENT = RGBColor(16, 185, 129)# Emerald 500
AMBER_ACCENT = RGBColor(245, 158, 11)# Amber 500
TEXT_WHITE = RGBColor(248, 250, 252) # Slate 50
TEXT_MUTED = RGBColor(148, 163, 184) # Slate 400
TEXT_DIM = RGBColor(100, 116, 139)   # Slate 500

def set_slide_background(slide):
    background = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    background.fill.solid()
    background.fill.fore_color.rgb = BG_DARK
    background.line.color.rgb = BG_DARK
    return background

def add_header(slide, category, title, slide_num=None):
    # Top Category Pill / Breadcrumb
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(10), Inches(0.35))
    tf = cat_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = category.upper()
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    # Main Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(10.5), Inches(0.6))
    tf2 = title_box.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = title
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE

    # Slide Number & Live link watermark at top right
    top_right = slide.shapes.add_textbox(Inches(9.5), Inches(0.4), Inches(3.0), Inches(0.4))
    tf3 = top_right.text_frame
    p3 = tf3.paragraphs[0]
    p3.alignment = PP_ALIGN.RIGHT
    p3.text = f"hospital-management-system-msz2.vercel.app"
    p3.font.size = Pt(10)
    p3.font.color.rgb = TEXT_DIM

    # Decorative accent bar under title
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(2.0), Inches(0.04))
    bar.fill.solid()
    bar.fill.fore_color.rgb = BLUE_ACCENT
    bar.line.fill.background()

def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)
    else:
        card.line.fill.background()
    return card

def add_bullet_point(tf, title, desc, icon="✦", title_color=TEXT_WHITE):
    p = tf.add_paragraph()
    p.space_after = Pt(12)
    run_icon = p.add_run()
    run_icon.text = f"{icon}  "
    run_icon.font.size = Pt(13)
    run_icon.font.bold = True
    run_icon.font.color.rgb = CYAN_ACCENT
    
    run_title = p.add_run()
    run_title.text = f"{title}: "
    run_title.font.size = Pt(13)
    run_title.font.bold = True
    run_title.font.color.rgb = title_color
    
    run_desc = p.add_run()
    run_desc.text = desc
    run_desc.font.size = Pt(12)
    run_desc.font.color.rgb = TEXT_MUTED

def add_image_with_frame(slide, img_path, left, top, width, height, caption=None):
    # Outer frame / bezel
    frame = add_card(slide, left - Inches(0.06), top - Inches(0.06), width + Inches(0.12), height + Inches(0.12), CARD_BG, BLUE_ACCENT)
    
    if os.path.exists(img_path):
        slide.shapes.add_picture(img_path, left, top, width, height)
    
    if caption:
        cap_box = slide.shapes.add_textbox(left, top + height + Inches(0.08), width, Inches(0.35))
        tf = cap_box.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = f"▶ {caption}"
        p.font.size = Pt(10)
        p.font.color.rgb = CYAN_ACCENT

# ==============================================================================
# SLIDE 1: Title & Hero Showcase
# ==============================================================================
s1 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s1)

# Large decorative glow card
hero_card = add_card(s1, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9), CARD_BG, BLUE_ACCENT)

# Badge: Frontend Class Project
badge = add_card(s1, Inches(1.3), Inches(1.3), Inches(3.2), Inches(0.45), BLUE_ACCENT, None)
tf = badge.text_frame
p = tf.paragraphs[0]
p.alignment = PP_ALIGN.CENTER
p.text = "🏥 FRONTEND WEB DEVELOPMENT"
p.font.size = Pt(11)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE

# Main Title
title_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.9), Inches(10.5), Inches(1.8))
tf = title_box.text_frame
tf.word_wrap = True
p = tf.paragraphs[0]
p.text = "MediCare Hospital Management System"
p.font.size = Pt(36)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE

p2 = tf.add_paragraph()
p2.space_before = Pt(8)
p2.text = "Complete Client-Side Healthcare Management Portal | Responsive SPA Architecture"
p2.font.size = Pt(17)
p2.font.color.rgb = CYAN_ACCENT

# Features Row / Highlights
tech_tags = ["Semantic HTML5", "Modern CSS3 (Variables & Grid)", "Vanilla JavaScript ES6+", "LocalStorage Data Persistence", "Vercel Production Deployment"]
for i, tag in enumerate(tech_tags):
    tag_card = add_card(s1, Inches(1.3 + (i * 2.15)), Inches(3.85), Inches(2.05), Inches(0.5), RGBColor(15, 23, 42), CARD_BORDER)
    tf = tag_card.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = tag
    p.font.size = Pt(9.2)
    p.font.color.rgb = TEXT_WHITE

# Project Team Box
team_box = add_card(s1, Inches(1.3), Inches(4.5), Inches(10.7), Inches(0.95), RGBColor(15, 23, 42), BLUE_ACCENT)
tf_t = team_box.text_frame
p_t = tf_t.paragraphs[0]
p_t.alignment = PP_ALIGN.CENTER
r1 = p_t.add_run()
r1.text = "👑 TEAM LEAD: "
r1.font.bold = True
r1.font.size = Pt(11)
r1.font.color.rgb = AMBER_ACCENT
r2 = p_t.add_run()
r2.text = "NISTALA SAI PHANEENDRA KUMAR         "
r2.font.bold = True
r2.font.size = Pt(12)
r2.font.color.rgb = TEXT_WHITE

r3 = p_t.add_run()
r3.text = "✦ TEAM MEMBERS: "
r3.font.bold = True
r3.font.size = Pt(10.5)
r3.font.color.rgb = CYAN_ACCENT
r4 = p_t.add_run()
r4.text = "KANASANI NEELAKANTA BALAJI   |   JAMMULA UDAY KIRAN"
r4.font.bold = True
r4.font.size = Pt(11.5)
r4.font.color.rgb = TEXT_WHITE

p_t2 = tf_t.add_paragraph()
p_t2.alignment = PP_ALIGN.CENTER
p_t2.space_before = Pt(3)
p_t2.text = "Frontend Web Development Class Project"
p_t2.font.size = Pt(10)
p_t2.font.color.rgb = TEXT_MUTED

# Live Vercel Banner inside hero
url_banner = add_card(s1, Inches(1.3), Inches(5.6), Inches(10.7), Inches(0.85), RGBColor(15, 23, 42), GREEN_ACCENT)
tf = url_banner.text_frame
p = tf.paragraphs[0]
p.alignment = PP_ALIGN.CENTER
p.text = "🌐 LIVE PRODUCTION DEPLOYMENT ON VERCEL:  https://hospital-management-system-msz2.vercel.app/"
p.font.size = Pt(12)
p.font.bold = True
p.font.color.rgb = GREEN_ACCENT

# ==============================================================================
# SLIDE 2: Problem Statement & Objectives
# ==============================================================================
s2 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s2)
add_header(s2, "Context & Motivation", "Why Digitize Healthcare Operations?")

# Left Card: Traditional Problems
c_left = add_card(s2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), CARD_BG, RGBColor(239, 68, 68))
title_box = s2.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(5.0), Inches(0.5))
tf = title_box.text_frame
p = tf.paragraphs[0]
p.text = "⚠️ Traditional Hospital Pitfalls"
p.font.size = Pt(18)
p.font.bold = True
p.font.color.rgb = RGBColor(239, 68, 68)

bullets_left = s2.shapes.add_textbox(Inches(1.1), Inches(2.4), Inches(5.0), Inches(4.2))
tf = bullets_left.text_frame
tf.word_wrap = True
add_bullet_point(tf, "Fragmented Paper Records", "Physical medical files get lost, misplaced, and take valuable time to retrieve during emergencies.", "✕", RGBColor(252, 165, 165))
add_bullet_point(tf, "Scheduling Conflicts", "Double bookings, missed follow-ups, and lack of real-time doctor availability calendars.", "✕", RGBColor(252, 165, 165))
add_bullet_point(tf, "Opaque Invoicing", "Manual calculations cause billing errors, missing charges, and delayed discharge settlements.", "✕", RGBColor(252, 165, 165))
add_bullet_point(tf, "Resource Blindspots", "Hospital admins have no live visibility into ICU bed occupancy, ventilators, or on-duty shifts.", "✕", RGBColor(252, 165, 165))

# Right Card: MediCare Solution
c_right = add_card(s2, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), CARD_BG, GREEN_ACCENT)
title_box2 = s2.shapes.add_textbox(Inches(7.1), Inches(1.8), Inches(5.0), Inches(0.5))
tf2 = title_box2.text_frame
p = tf2.paragraphs[0]
p.text = "💡 MediCare Frontend Solution"
p.font.size = Pt(18)
p.font.bold = True
p.font.color.rgb = GREEN_ACCENT

bullets_right = s2.shapes.add_textbox(Inches(7.1), Inches(2.4), Inches(5.0), Inches(4.2))
tf2 = bullets_right.text_frame
tf2.word_wrap = True
add_bullet_point(tf2, "Unified Digital Dashboard", "Real-time key performance indicators: admitted patients, revenue, today's appointments, available beds.", "✓", GREEN_ACCENT)
add_bullet_point(tf2, "Instant CRUD Management", "Zero-latency patient onboarding, doctor directories, and dynamic medical history tracking.", "✓", GREEN_ACCENT)
add_bullet_point(tf2, "Automated Billing & Rx", "Live itemized invoice calculation, dynamic medicine rows, and print-ready formal receipts.", "✓", GREEN_ACCENT)
add_bullet_point(tf2, "Client-Side Speed & Privacy", "Full offline-capable persistence via Web Storage API with zero backend server lag.", "✓", GREEN_ACCENT)

# ==============================================================================
# SLIDE 3: Frontend Architecture & Tech Stack
# ==============================================================================
s3 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s3)
add_header(s3, "Engineering Architecture", "Core Technologies & Design Decisions")

tech_cards = [
    ("HTML5 Semantic Architecture", "• Clean structural markup (aside, header, section, table, modal)\n• Accessible form inputs with instant pattern validation\n• Deep modal overlays with backdrop event delegation\n• Zero framework bloat – 100% lightweight semantic standards", BLUE_ACCENT),
    ("Modern CSS3 Styling Engine", "• Comprehensive 1,600+ line stylesheet with :root variables\n• Responsive layout via CSS Grid & Flexbox system\n• Dark Mode theme toggle with instant CSS variable swap\n• Dedicated @media print stylesheets for formal hospital invoices", CYAN_ACCENT),
    ("Vanilla JavaScript ES6+", "• 1,400+ lines of robust, modular client-side logic\n• Route-aware page lifecycle initializers\n• Dynamic DOM templating with sanitization\n• Custom Toast notification engine with auto-dismiss animations", GREEN_ACCENT),
    ("Web Storage & Cloud Vercel", "• LocalStorage persistence across all 7 operational modules\n• Pre-seeded realistic healthcare datasets (INR currency)\n• Global CDN deployment via Vercel continuous deployment\n• Sub-second global load times with 100% uptime", AMBER_ACCENT)
]

for idx, (title, content, color) in enumerate(tech_cards):
    row = idx // 2
    col = idx % 2
    card = add_card(s3, Inches(0.8 + (col * 5.95)), Inches(1.6 + (row * 2.7)), Inches(5.7), Inches(2.45), CARD_BG, color)
    tb = s3.shapes.add_textbox(Inches(1.0 + (col * 5.95)), Inches(1.75 + (row * 2.7)), Inches(5.3), Inches(0.45))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = f"⚙ {title}"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = color
    
    tb2 = s3.shapes.add_textbox(Inches(1.0 + (col * 5.95)), Inches(2.2 + (row * 2.7)), Inches(5.3), Inches(1.7))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    for line in content.split('\n'):
        p_line = tf2.add_paragraph()
        p_line.text = line
        p_line.font.size = Pt(11.5)
        p_line.font.color.rgb = TEXT_WHITE
        p_line.space_after = Pt(3)

# ==============================================================================
# SLIDE 4: Role-Based Authentication & Portal Entry
# ==============================================================================
s4 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s4)
add_header(s4, "Module 01", "User Authentication & Role-Based Entry")

# Left Column: Technical Details
c_left = add_card(s4, Inches(0.8), Inches(1.6), Inches(4.8), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s4.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "Key Technical Features"
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "Role Selector Switcher", "Multi-role buttons (Admin, Doctor, Receptionist) with active state visual feedback.", "🔑")
add_bullet_point(tf, "Client-Side Validation", "HTML5 form validation preventing empty submissions with styled input focus rings.", "🛡️")
add_bullet_point(tf, "Animated Toast Feedback", "Custom animated toast triggers on submit: 'Login successful! Redirecting...'", "🔔")
add_bullet_point(tf, "State Storage", "Saves chosen user role to localStorage.getItem('hms_user_role') for session continuity.", "💾")
add_bullet_point(tf, "Smooth Transitions", "CSS keyframe animations for floating hospital logo and glowing card borders.", "✨")

# Right Column: Screenshot
add_image_with_frame(s4, "screenshots/01_login.png", Inches(5.9), Inches(1.6), Inches(6.6), Inches(5.1), "Live Deployed Login Screen (hospital-management-system-msz2.vercel.app)")

# ==============================================================================
# SLIDE 5: Interactive Executive Dashboard
# ==============================================================================
s5 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s5)
add_header(s5, "Module 02", "Interactive Executive Dashboard & Analytics")

# Left Column: Features
c_left = add_card(s5, Inches(0.8), Inches(1.6), Inches(4.8), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s5.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "Dashboard Capabilities"
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "Real-Time Stat Cards", "Auto-computes Total Patients, Today's Appointments, Gross Revenue (₹), and Bed Availability.", "📊")
add_bullet_point(tf, "Department Visualizer", "Dynamic CSS percentage progress bars comparing patient volume across Cardiology, Ortho, etc.", "📈")
add_bullet_point(tf, "Recent Appointments Table", "Synchronized live table rendering patient names, doctors, timestamps, and status badges.", "⏱️")
add_bullet_point(tf, "Quick Action Triggers", "One-click shortcuts to register patients, book consults, generate bills, or write prescriptions.", "⚡")

# Right Column: Screenshot
add_image_with_frame(s5, "screenshots/02_dashboard.png", Inches(5.9), Inches(1.6), Inches(6.6), Inches(5.1), "Live Executive Dashboard showing computed statistics & recent visits")

# ==============================================================================
# SLIDE 6: Patient Records & Medical History
# ==============================================================================
s6 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s6)
add_header(s6, "Module 03", "Patient Directory & Medical History Timeline")

c_left = add_card(s6, Inches(0.8), Inches(1.6), Inches(4.8), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s6.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "Patient Management"
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "Real-Time Live Search", "Instant table filtering across patient name, ID (e.g. P001), phone number, or diagnosed condition.", "🔍")
add_bullet_point(tf, "Comprehensive Modal Forms", "Add/Edit modal with age, gender, blood group, contact info, diagnosis, and admission status.", "📝")
add_bullet_point(tf, "Medical History Timeline", "View modal renders a chronological timeline of doctor visits, surgery logs, and lab results.", "🧬")
add_bullet_point(tf, "Status Badging", "Color-coded pills: Green for Admitted, Blue for Outpatient, Gray for Discharged.", "🏷️")

add_image_with_frame(s6, "screenshots/03_patients.png", Inches(5.9), Inches(1.6), Inches(6.6), Inches(5.1), "Patient Management interface with live search and status indicators")

# ==============================================================================
# SLIDE 7: Doctor Directory & Availability Management
# ==============================================================================
s7 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s7)
add_header(s7, "Module 04", "Doctor Profiles & Weekly Scheduling Grid")

c_left = add_card(s7, Inches(0.8), Inches(1.6), Inches(4.8), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s7.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "Doctor Portal Engine"
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "Responsive Doctor Cards", "CSS Grid cards displaying physician avatar, department tag, phone, and experience years.", "👨‍⚕️")
add_bullet_point(tf, "Department Filtering", "Instant dropdown filtering by Cardiology, Neurology, Pediatrics, Orthopedics, and Dermatology.", "🎯")
add_bullet_point(tf, "Weekly Schedule Matrix", "Detailed schedule view for Mon-Sun showing clinical hours or 'Off' duty status.", "📅")
add_bullet_point(tf, "Availability Indicator", "Pulsing indicator dots: Green (Available), Red (On Leave), Yellow (In Consultation).", "🟢")

add_image_with_frame(s7, "screenshots/04_doctors.png", Inches(5.9), Inches(1.6), Inches(6.6), Inches(5.1), "Doctor Directory with department badges and live contact cards")

# ==============================================================================
# SLIDE 8: Appointment Scheduling (Dual View)
# ==============================================================================
s8 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s8)
add_header(s8, "Module 05", "Appointment Engine: List & Interactive Calendar")

# Left Column: Features
c_left = add_card(s8, Inches(0.8), Inches(1.6), Inches(4.2), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s8.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(3.8), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "Dual-View System"
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "Interactive Calendar Grid", "Custom Vanilla JS calendar algorithm calculating month days, leap years, and active appointment dots.", "🗓️")
add_bullet_point(tf, "Tabular List View", "Complete table with actions to mark Completed, Cancel, or Reschedule visits.", "📋")
add_bullet_point(tf, "Relational Booking", "Dropdowns dynamically linked to stored Patients & Doctors to eliminate orphaned records.", "🔗")

# Right Column: Two stacked screenshots
add_image_with_frame(s8, "screenshots/05_appointments_list.png", Inches(5.3), Inches(1.6), Inches(7.2), Inches(2.4), "Tabular Appointment List View with Status Toggles")
add_image_with_frame(s8, "screenshots/06_appointments_calendar.png", Inches(5.3), Inches(4.4), Inches(7.2), Inches(2.4), "Interactive Monthly Calendar View with Event Indicators")

# ==============================================================================
# SLIDE 9: Invoicing & Billing Engine
# ==============================================================================
s9 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s9)
add_header(s9, "Module 06", "Invoicing, Financial Analytics & Print View")

c_left = add_card(s9, Inches(0.8), Inches(1.6), Inches(4.8), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s9.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "Financial Features"
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "Revenue KPI Breakdown", "Tracks Total Revenue (₹), Pending Receivables, Paid Count, and Overdue Alerts.", "💰")
add_bullet_point(tf, "Dynamic Item Rows", "Add/Remove custom billable items (Consultation, ICU, Lab Test) with live auto-sum total calculation.", "🧮")
add_bullet_point(tf, "Multi-Payment Support", "Cash, Card, UPI, and Health Insurance tagging for billing reconciliation.", "💳")
add_bullet_point(tf, "Formal Print Layout", "Dedicated @media print stylesheet rendering a professional hospital invoice header and tax summary.", "🖨️")

add_image_with_frame(s9, "screenshots/07_billing.png", Inches(5.9), Inches(1.6), Inches(6.6), Inches(5.1), "Billing management dashboard with financial metrics and invoice list")

# ==============================================================================
# SLIDE 10: Prescriptions & Medical Instructions
# ==============================================================================
s10 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s10)
add_header(s10, "Module 07", "Digital Prescriptions & Pharmacy Workflow")

c_left = add_card(s10, Inches(0.8), Inches(1.6), Inches(4.8), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s10.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "Prescription Engine"
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "Structured Rx Format", "Formal medical prescription format with patient diagnostics, physician license, and Rx watermark.", "💊")
add_bullet_point(tf, "Dynamic Medicine Builder", "Doctors can dynamically add multiple medicine rows: dosage, frequency (e.g. SOS, BD), and duration.", "🧪")
add_bullet_point(tf, "Doctor Advice Notes", "Specific clinical instructions (e.g., diet restrictions, follow-up timeline, physiotherapy).", "📋")
add_bullet_point(tf, "One-Click Print", "Browser print hook rendering clean document layout ready for patient take-home or pharmacy dispensing.", "🖨️")

add_image_with_frame(s10, "screenshots/08_prescriptions.png", Inches(5.9), Inches(1.6), Inches(6.6), Inches(5.1), "Prescription management table with diagnostics and medication details")

# ==============================================================================
# SLIDE 11: Administration: Staff & Resource Tracking
# ==============================================================================
s11 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s11)
add_header(s11, "Module 08", "Hospital Administration & Resource Allocation")

c_left = add_card(s11, Inches(0.8), Inches(1.6), Inches(4.2), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s11.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(3.8), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "Admin Capabilities"
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "Staff Shift Roster", "Tracks nurses, lab technicians, and pharmacists across Morning, Evening, and Night shifts.", "👥")
add_bullet_point(tf, "Resource Capacity Bars", "Visual utilization indicators for ICU Beds, General Beds, Ventilators, X-Rays, and Ambulances.", "🏥")
add_bullet_point(tf, "Live Allocation Updates", "Admins can dynamically adjust occupied vs total counts to reflect hospital admissions in real-time.", "🔄")

add_image_with_frame(s11, "screenshots/09_admin_staff.png", Inches(5.3), Inches(1.6), Inches(7.2), Inches(2.4), "Staff Management Roster with duty status and shift badges")
add_image_with_frame(s11, "screenshots/10_admin_resources.png", Inches(5.3), Inches(4.4), Inches(7.2), Inches(2.4), "Resource Allocation dashboard showing bed & equipment utilization bars")

# ==============================================================================
# SLIDE 12: MediCare AI Health Assistant
# ==============================================================================
s_ai = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s_ai)
add_header(s_ai, "Innovation Showcase", "MediCare AI Health Assistant & Clinical Triage")

c_left = add_card(s_ai, Inches(0.8), Inches(1.6), Inches(4.8), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s_ai.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "AI Conversational Features"
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "Symptom Triage Engine", "Analyzes complaints (fever, cardiac tightness, fractures) and directs to the appropriate department.", "🤖")
add_bullet_point(tf, "Voice Speech Recognition", "Integrated HTML5 Web Speech API allowing hands-free microphone voice queries.", "🎙️")
add_bullet_point(tf, "Emergency SOS Protocols", "Flags acute medical distress keywords with immediate 108 ambulance contact directives.", "🚨")
add_bullet_point(tf, "Interactive Action Shortcuts", "Generates direct in-chat appointment booking and physician consultation buttons.", "⚡")

add_image_with_frame(s_ai, "screenshots/12_ai_chatbot.png", Inches(5.9), Inches(1.6), Inches(6.6), Inches(5.1), "MediCare AI Health Assistant in Action (Triage & Speech Recognition)")

# ==============================================================================
# SLIDE 13: Modern UI/UX: Dark Mode & Responsive Layout
# ==============================================================================
s12 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s12)
add_header(s12, "Design Engineering", "CSS Architecture, Dark Mode & Responsiveness")

c_left = add_card(s12, Inches(0.8), Inches(1.6), Inches(4.8), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s12.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(4.4), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "CSS Engineering Highlights"
p.font.size = Pt(17)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "CSS Variables Engine", "Over 20 theme variables (:root) controlling background, surface, text, and border tokens.", "🎨")
add_bullet_point(tf, "Instant Dark Mode", "Seamless theme toggle applying .dark-mode to body, persisting preference in localStorage.", "🌙")
add_bullet_point(tf, "Fluid Responsive Sidebar", "Collapsible navigation with icon-only compact mode for tablets and off-canvas drawer for mobile.", "📱")
add_bullet_point(tf, "Accessibility & Typography", "Using Google Inter font with high contrast WCAG ratios and readable healthcare iconography.", "👁️")

add_image_with_frame(s12, "screenshots/11_dashboard_dark.png", Inches(5.9), Inches(1.6), Inches(6.6), Inches(5.1), "Executive Dashboard rendered in Dark Mode via CSS Variables")

# ==============================================================================
# SLIDE 13: Live Deployment & Production Highlights
# ==============================================================================
s13 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s13)
add_header(s13, "Deployment & DevOps", "Live Production on Vercel Edge Network")

# 3 Stat Cards on Top
stats = [
    ("100% Client-Side", "Zero backend latency, instant tab switching", BLUE_ACCENT),
    ("Edge CDN Powered", "Instant load times worldwide via Vercel", GREEN_ACCENT),
    ("Zero Dependencies", "Pure Vanilla JS, HTML5 & CSS3", CYAN_ACCENT)
]

for i, (title, desc, color) in enumerate(stats):
    card = add_card(s13, Inches(0.8 + (i * 3.97)), Inches(1.6), Inches(3.8), Inches(1.5), CARD_BG, color)
    tb = s13.shapes.add_textbox(Inches(1.0 + (i * 3.97)), Inches(1.75), Inches(3.4), Inches(1.2))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = color
    p2 = tf.add_paragraph()
    p2.space_before = Pt(6)
    p2.text = desc
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_MUTED

# Big URL Showcase Box
url_box = add_card(s13, Inches(0.8), Inches(3.4), Inches(11.733), Inches(3.5), CARD_BG, GREEN_ACCENT)
tb = s13.shapes.add_textbox(Inches(1.2), Inches(3.7), Inches(11.0), Inches(2.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "🚀 Production URL:"
p.font.size = Pt(16)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE

p2 = tf.add_paragraph()
p2.space_before = Pt(6)
p2.text = "https://hospital-management-system-msz2.vercel.app/"
p2.font.size = Pt(22)
p2.font.bold = True
p2.font.color.rgb = GREEN_ACCENT

p3 = tf.add_paragraph()
p3.space_before = Pt(16)
p3.text = "Why Vercel Deployment Matters in a Frontend Class:"
p3.font.size = Pt(15)
p3.font.bold = True
p3.font.color.rgb = CYAN_ACCENT

points = [
    "✦ Instant Verification: Instructors and classmates can test all features on their laptops or mobile phones right now.",
    "✦ Continuous Delivery: Changes pushed to Git repository automatically build and deploy within seconds.",
    "✦ Modern Web Standards: Serves modern HTTP/2 assets with Brotli compression and HTTPS security out-of-the-box."
]
for pt in points:
    p_pt = tf.add_paragraph()
    p_pt.space_before = Pt(6)
    p_pt.text = pt
    p_pt.font.size = Pt(13)
    p_pt.font.color.rgb = TEXT_MUTED

# ==============================================================================
# SLIDE 14: Conclusion & Q&A
# ==============================================================================
s14 = prs.slides.add_slide(blank_slide_layout)
set_slide_background(s14)
add_header(s14, "Wrap Up", "Key Learnings, Technical Takeaways & Q&A")

# Left Column: Key Learnings
c_left = add_card(s14, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.3), CARD_BG, CARD_BORDER)
tb = s14.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(5.1), Inches(4.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "🎓 Key Frontend Learnings"
p.font.size = Pt(18)
p.font.bold = True
p.font.color.rgb = CYAN_ACCENT

add_bullet_point(tf, "Modular DOM Manipulation", "Learned how to dynamically construct complex UI elements without heavy frontend frameworks.", "⭐")
add_bullet_point(tf, "Scalable CSS Architecture", "Mastered CSS custom properties, grid layouts, fluid sidebar toggling, and dark mode theming.", "⭐")
add_bullet_point(tf, "State Management & Storage", "Designed persistent client-side data stores using JSON serialization and Web Storage.", "⭐")
add_bullet_point(tf, "Real-World UX Standards", "Implemented micro-interactions, modal management, and accessible form validations.", "⭐")

# Right Column: Thank You & Live Demo
c_right = add_card(s14, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), CARD_BG, BLUE_ACCENT)
tb = s14.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.1), Inches(4.2))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.alignment = PP_ALIGN.CENTER
p.text = "Thank You!"
p.font.size = Pt(36)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE

p2 = tf.add_paragraph()
p2.alignment = PP_ALIGN.CENTER
p2.space_before = Pt(12)
p2.text = "Questions & Live Demonstration"
p2.font.size = Pt(20)
p2.font.bold = True
p2.font.color.rgb = CYAN_ACCENT

p3 = tf.add_paragraph()
p3.alignment = PP_ALIGN.CENTER
p3.space_before = Pt(14)
p3.text = "👑 Team Lead: NISTALA SAI PHANEENDRA KUMAR\n✦ Team Members: KANASANI NEELAKANTA BALAJI | JAMMULA UDAY KIRAN"
p3.font.size = Pt(11.5)
p3.font.bold = True
p3.font.color.rgb = CYAN_ACCENT

p4 = tf.add_paragraph()
p4.alignment = PP_ALIGN.CENTER
p4.space_before = Pt(14)
p4.text = "Live Demo: hospital-management-system-msz2.vercel.app"
p4.font.size = Pt(14)
p4.font.bold = True
p4.font.color.rgb = GREEN_ACCENT

prs.save('presentation/Medicare_HMS_Presentation.pptx')
print("Complete PowerPoint presentation generated at presentation/Medicare_HMS_Presentation.pptx")
