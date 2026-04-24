# Resume From Projects + URL Keyword Format Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate the resume section of `index.html` from the same project `.md` files that drive the portfolio, and change URL filtering from `?discipline=product` to `?product+design` keyword syntax.

**Architecture:** A new `build-resume.js` script reads `resume-data/employers.md` (employer/role structure) and `projects/*.md` (project entries with `resume_section` fields), generates `<section class="resume-employer" data-disciplines="...">` wrappers per employer, and splices them between `<!-- RESUME_GENERATED_START -->` / `<!-- RESUME_GENERATED_END -->` markers in `index.html`. URL parsing changes from `URLSearchParams` to splitting the search string on `+` and mapping keywords through `KEYWORD_MAP`.

**Tech Stack:** Node ESM, gray-matter, jQuery 3.3.1 (client-side filtering), Vite 5

---

## File Map

- **Create:** `resume-data/employers.md` — YAML frontmatter with employer/role structure
- **Create:** `projects/self-service-program.md`, `projects/checkr-direct.md`, `projects/segmentation-enterprise.md`, `projects/expungements.md`, `projects/federated-identity-sso.md`, `projects/fairness-framework.md`, `projects/digital-platform-strategy.md`, `projects/gap-validated-learning.md`, `projects/response-innovation-lab.md` — resume-only project entries
- **Modify:** `projects/qcon.md`, `projects/qbo.md`, `projects/nmfg.md`, `projects/ucsf.md`, `projects/hutton.md`, `projects/youareatourist.md`, `projects/adidasallin.md`, `projects/bornfree.md`, `projects/thenaturebetweenus.md`, `projects/theexecutionofsolomonharris.md` — add resume fields
- **Modify:** `scripts/build-portfolio.js` — skip entries where `portfolio: false`
- **Modify:** `scripts/test-build-portfolio.js` — add test for `portfolio: false` filtering
- **Create:** `scripts/build-resume.js` — resume HTML generator
- **Create:** `scripts/test-build-resume.js` — Node assert tests for resume generation
- **Modify:** `index.html` — replace static resume content with markers; update client-side JS (URL parsing, `filterPortfolio`, new `filterResume`); update `navctrl('resume')` to call `filterResume('all')`
- **Modify:** `package.json` — wire build-resume into prebuild, add `build-resume` script

---

### Task 1: Create `resume-data/employers.md`

**Files:**
- Create: `resume-data/employers.md`

- [ ] **Step 1: Create the file**

```bash
mkdir -p resume-data
```

Write `resume-data/employers.md` with this exact content:

```markdown
---
employers:
  - id: pariveda
    name: Pariveda
    url: "https://www.parivedasolutions.com"
    disciplines: [product]
    roles:
      - id: pariveda-principal
        title: "Principal"
        dates: "2022 - present"
        descriptions: []

  - id: checkr
    name: Checkr
    url: "https://www.checkr.com"
    disciplines: [product]
    roles:
      - id: checkr-sgpm
        title: "Senior Group Product Manager, Self-Service"
        dates: "2019 - 2022"
        descriptions:
          - "Led a program encompassing six teams to build the best experience in our industry for our partners, customers, and their developers by enabling them to do more, do it faster, and without human intervention by Checkr."

  - id: thoughtworks
    name: ThoughtWorks
    url: "https://www.thoughtworks.com/about-us"
    disciplines: [interactive, product]
    roles:
      - id: thoughtworks-lead
        title: "Lead Product Strategist, Emerging Technologies"
        dates: "2013 - 2019"
        descriptions:
          - "Provided lead product management for clients of a mission-driven creative technology consultancy, helped leaders of start-ups and Fortune 500 companies around the world deliver products that matter to their users."
          - "Built and directed teams as large as 100 people with budgets ranging up to millions of dollars, leveraging exceptional interpersonal, organizational, and product management skills to lead with empathy, innovation, and passion."
          - "Managed the entire product life-cycle, from ideation and strategic development to producing rapidly iterated prototypes and shipping final products."
      - id: thoughtworks-sej
        title: "Social and Economic Justice Lead, San Francisco"
        dates: "2015 - 2018"
        descriptions:
          - "Led and organized initiatives for activists, non-profits, and a few radical librarians to exponentially increase their impact and serve vulnerable communities."
          - "Created and maintained partner relationships and initiatives for the San Franciso ThoughtWorks office."
          - "Recognized for technology innovation in the healthcare space for UCSF Virtual Mentor, winner of a &ldquo;Saving Lives at Birth&rdquo; Seed Grant and a winner of Johnson &amp; Johnson&rsquo;s GenH Challenge."

  - id: playsets
    name: "The Playsets Team, LLC"
    url: "https://youtu.be/mNgjgNSpVGA&list=PL5AjSG-LQwc6m96V_t2jgG_08UElFIhmi"
    url_target: "_window"
    h2_trigger: playsets
    disciplines: [interactive, product]
    roles:
      - id: playsets-founder
        title: "Co-Founder &amp; Product Designer"
        dates: "2013 - 2018"
        descriptions:
          - 'Designed and brought to market &ldquo;Playsets&rdquo;, a collection of digital maps and miniatures for epic remote role-playing, resulting in tens of thousands of users in over 100 countries.'
          - 'Designed and executed product marketing strategies, including successful <a href="https://www.kickstarter.com/projects/985647565/playsets-the-future-of-social-storytelling" target="_window">Kickstarter</a> and <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=866256995" target="_window">Steam Greenlight</a> campaigns.'
          - 'Selected for <a href="http://indiemegabooth.com/event/pax-prime-2015/" target="_window">Indie Megabooth</a> at PAX Prime.'

  - id: discovery
    name: Discovery Communications
    url: "https://www.discovery.com/"
    url_target: "_window"
    disciplines: [product]
    roles:
      - id: discovery-dir
        title: "Director of Product and Engineering, MyDiscovery"
        dates: "2011 - 2013"
        descriptions:
          - "Provided leadership for a team of developers and designers creating an online &ldquo;Social Knowledge&rdquo; platform, overseeing hiring, development, and mentorship for the team."
          - "Head of Product for &ldquo;Collagio,&rdquo; an app that let users easily create, share, and discover collections of curated and original content."
          - "Collaborated closely with developers and designers to prototype, validate, prepare product specs, and launch products."

  - id: eyeboogie
    name: Eyeboogie Inc
    url: "http://www.eyeboogie.com/"
    disciplines: [product]
    roles:
      - id: eyeboogie-coo
        title: "Chief Operating Officer, Eyeboogie Labs"
        dates: "2010 - 2011"
        descriptions:
          - "Created and managed a profitable independent subsidiary, Eyeboogie Labs; oversaw operations, strategic vision, building partnerships, and securing and maintaining clients."
          - "Extended existing and new relationships into new opportunities in social media, interactive experiences, and application development."
          - "Directed digital product development, including websites, apps (web and iOS), and custom streaming video solutions."
          - "Designed &ldquo;Pop Tool&rdquo; a video workflow tool and knowledge base that allowed writers of &ldquo;Pop Up Video 2.0&rdquo; to work exponentially faster than previously possible."
      - id: eyeboogie-dnm
        title: "Director of New Media"
        dates: "2007 - 2010"
        descriptions:
          - "Integrated technology into multiple television projects allowing for new production capabilities including multi-channel integrations for live audience voting and live video streaming."
          - "Produced a documentary featured on &ldquo;Natural Born Killers&rdquo; Blu-Ray release."

  - id: production-design
    name: Production Design
    disciplines: [production]
    roles:
      - id: production-design-freelance
        descriptions:
          - "Worked closely with directors, producers, and cinematographers to achieve the overall visual look of film projects. Responsible for execution including designing sets, drafting, budgeting, managing and participating in construction, and leading the art department during production."
---
```

- [ ] **Step 2: Commit**

```bash
git add resume-data/employers.md
git commit -m "feat: add employers.md with full resume employer/role structure"
```

---

### Task 2: Create 9 resume-only project files

**Files:**
- Create: `projects/self-service-program.md` through `projects/response-innovation-lab.md`

- [ ] **Step 1: Create all 9 files**

Write `projects/self-service-program.md`:
```markdown
---
slug: self-service-program
title: Self-Service Program
portfolio: false
resume_section: checkr-sgpm
resume_order: 1
resume_entry_title: "Self-Service Program"
resume_role: "Program Lead, Product Manager"
resume_description: "Developer Experience, Partner Experience, self service sign-up, Admin tooling, Editable Packages, Password-less log-in for candidates."
---
```

Write `projects/checkr-direct.md`:
```markdown
---
slug: checkr-direct
title: Checkr Direct
portfolio: false
resume_section: checkr-sgpm
resume_order: 2
resume_entry_title: "Checkr Direct"
resume_role: "Product Manager"
resume_description: "Created a self-service sign-up flow for onboarding new customers without sales intervention. Onboarded over 250 new customers a week within two quarters."
---
```

Write `projects/segmentation-enterprise.md`:
```markdown
---
slug: segmentation-enterprise
title: Segmentation and Enterprise
portfolio: false
resume_section: checkr-sgpm
resume_order: 3
resume_entry_title: "Segmentation and Enterprise"
resume_role: "Program Lead, Product Manager"
resume_description: "Designed a new object model for a fundamental capability, account hierarchy management, and led a team in its development and implementation and migration of customers. This unlocked millions in business for new enterprise customers and existing customers of all types and was implemented without impacting existing customers during migration."
---
```

Write `projects/expungements.md`:
```markdown
---
slug: expungements
title: Expungements
portfolio: false
resume_section: checkr-sgpm
resume_order: 4
resume_entry_title: "Expungements"
resume_role: "Product Strategist"
resume_description: "Helped to create the cheapest expungement service in the US, providing hundreds of sponsored expungements."
resume_bullets:
  - "Winner of a Schmidt Futures grant"
  - "Winner of Checkr Hack Week"
resume_link_url: "https://checkr.com/expungements"
---
```

Write `projects/federated-identity-sso.md`:
```markdown
---
slug: federated-identity-sso
title: Federated Identity and SSO
portfolio: false
resume_section: checkr-sgpm
resume_order: 5
resume_entry_title: "Federated Identity and SSO"
resume_role: "Product Manager"
resume_description: "Designed and directed the implementation of an Identity and Access Management solution. Negotiated deal with vendor and managed migration with zero downtime to existing users. Federated Identity was a critical component of unlocking enterprise customers."
---
```

Write `projects/fairness-framework.md`:
```markdown
---
slug: fairness-framework
title: Fairness Framework
portfolio: false
resume_section: checkr-sgpm
resume_order: 6
resume_entry_title: "Fairness Framework"
resume_role: "Co-Author"
resume_description: "Helped author a commitment which was adopted by our company and shared publicly to help us continue to be held accountable to our mission of fairness."
resume_link_url: "https://checkr.com/our-fairness-commitment"
---
```

Write `projects/digital-platform-strategy.md`:
```markdown
---
slug: digital-platform-strategy
title: Digital Platform Strategy
portfolio: false
resume_section: thoughtworks-lead
resume_order: 1
resume_entry_title: "ThoughtWorks, Digital Platform Strategy Offering"
resume_role: "Product Manager"
resume_description: "Head of product for a new offering helping clients build platforms for development around their business capabilities."
---
```

Write `projects/gap-validated-learning.md`:
```markdown
---
slug: gap-validated-learning
title: GAP Inc, Validated Learning Process
portfolio: false
resume_section: thoughtworks-lead
resume_order: 4
resume_entry_title: "GAP Inc, Validated learning process"
resume_role: "Product Strategist"
resume_description: "Worked with the VP of Engineering to institute a new method for innovation across the organization and to change the development process between Product and Engineering. Led an innovation team of stakeholders, developers, and designers. Trained client stakeholders and helped implement hypothesis-driven design and development across the IT organization. Evangelized and executed rapid prototyping and in-store testing of hypotheses to save development time and costs."
---
```

Write `projects/response-innovation-lab.md`:
```markdown
---
slug: response-innovation-lab
title: Response Innovation Lab, Matchmaker
portfolio: false
resume_section: thoughtworks-sej
resume_order: 2
resume_entry_title: "Response Innovation Lab, Matchmaker"
resume_role: "Product Strategist"
resume_description: "Designer and Program manager for a platform for humanitarian sector problem-holders to be matched with advisers and solutions, overseeing an MVP for pilot programs in Jordan, Somalia, and Puerto Rico."
resume_link_url: "https://responseinnovationlab.com/matchmaker/"
resume_link_target: "_window"
resume_link_type: iframe
---
```

- [ ] **Step 2: Commit**

```bash
git add projects/self-service-program.md projects/checkr-direct.md projects/segmentation-enterprise.md projects/expungements.md projects/federated-identity-sso.md projects/fairness-framework.md projects/digital-platform-strategy.md projects/gap-validated-learning.md projects/response-innovation-lab.md
git commit -m "feat: add 9 resume-only project files"
```

---

### Task 3: Add resume fields to 10 existing project files

**Files:**
- Modify: `projects/qcon.md`, `projects/qbo.md`, `projects/nmfg.md`, `projects/ucsf.md`, `projects/hutton.md`, `projects/youareatourist.md`, `projects/adidasallin.md`, `projects/bornfree.md`, `projects/thenaturebetweenus.md`, `projects/theexecutionofsolomonharris.md`

- [ ] **Step 1: Update `projects/qcon.md`** — append fields before closing `---`:

Replace the existing frontmatter with:
```markdown
---
slug: qcon
title: QCon Conference Wearables
disciplines: [interactive]
order: 7
resume_section: thoughtworks-lead
resume_order: 2
resume_entry_title: "C4 Media, Conference feedback platform"
resume_role: "Product Manager"
resume_description: "Product Manager for the creation and execution of a platform of participant feedback wearables for the QCon international developer conference. Rapid prototyping, using custom hardware, with on-site testing in multiple cities. Custom FCC and CE certified hardware created with a manufacturer in Shenzhen. Created industrial design for wearable and directly oversaw its production."
resume_link_url: "https://youtu.be/DEkq6Hr71OA"
resume_link_trigger: qcon
resume_link_title: "Qcon case study"
media:
  - qcon-0.jpg
  - https://youtu.be/DEkq6Hr71OA
  - https://youtu.be/Mpgg2dFjg5A
  - https://youtu.be/xZFSkbJ-aJ0
  - https://youtu.be/W0xyrc0oGZo
  - qcon-1.jpg
  - qcon-2.jpg
  - qcon-3.jpg
  - qcon-4.jpg
  - qcon-5.jpg
---
```

- [ ] **Step 2: Update `projects/qbo.md`**:

```markdown
---
slug: qbo
title: Q-bo Connected Coffee Machine
disciplines: [interactive]
order: 8
resume_section: thoughtworks-lead
resume_order: 3
resume_entry_title: "Tchibo, Connected coffee machine"
resume_role: "Product Strategist"
resume_description: "Defined product strategy and led a development team for the embedded computer interface for the Q-bo connected coffee machine as well as the corresponding smartphone app and loyalty program. Rapid prototyping, with a 3D printed coffee machine and custom hardware, to enable user testing a year before production hardware was available. Hardware component selection for an embedded computer for a mass-produced consumer device."
resume_link_url: "https://youtu.be/hVk3VHgqY0w"
resume_link_trigger: qbo
resume_link_target: "_window"
media:
  - qbo-0.jpg
  - https://youtu.be/hVk3VHgqY0w
  - qbo-1.jpg
  - qbo-2.jpg
  - qbo-3.jpg
  - qbo-4.jpg
  - qbo-5.jpg
  - qbo-6.m4v
---
```

- [ ] **Step 3: Update `projects/nmfg.md`**:

```markdown
---
slug: nmfg
title: Natural Markets Food Group
disciplines: [product]
order: 9
resume_section: thoughtworks-lead
resume_order: 5
resume_entry_title: "Natural Markets Food Group, Retail food at Eaton Center"
resume_role: "Lead Product Manager"
resume_description: "Defined product differentiation for a retail food/restaurant concept at Toronto Eaton Center, conceptualizing and designing technologies for customer payment, customer experience, online ordering, and Point of Sales and Operations. Led product development teams in multiple cities and managed 13 vendors across two countries. Managed service design and technology for the launch of a multi-vendor food concept in Toronto Eaton Center with a six-month deadline."
resume_link_url: "https://youtu.be/yG28QGNVWkA"
resume_link_trigger: nmfg
resume_link_target: "_window"
media:
  - nmfg-0.jpg
  - https://youtu.be/yG28QGNVWkA
  - nmfg-1.jpg
  - nmfg-2.jpg
  - nmfg-3.jpg
  - nmfg-4.jpg
  - nmfg-5.jpg
  - nmfg-6.jpg
  - nmfg-7.jpg
---
```

- [ ] **Step 4: Update `projects/ucsf.md`**:

```markdown
---
slug: ucsf
title: UCSF Virtual Mentor
disciplines: [interactive]
order: 4
resume_section: thoughtworks-sej
resume_order: 1
resume_entry_title: "UCSF Virtual Mentor"
resume_role: "Product Manager"
resume_description: "Led development for a voice-controlled, virtual assistant that guides birth attendants through complicated or emergency procedures, for University of California-San Francisco's Institute for Global Health Sciences. Rapid prototyping with on-site testing at UCSF and medical facility in Nairobi. Programmed an AI chatbot in the IBM Watson Ecosystem."
resume_bullets:
  - 'Winner of <a href="http://globalhealthsciences.ucsf.edu/news/star-trek-inspired-virtual-mentor-wins-saving-lives-birth-seed-grant" target="_window">Saving Lives at Birth Seed Grant</a>'
  - 'Winner of <a href="https://www.jnj.com/innovation/6-healthcare-entrepreneurs-who-could-make-genh-the-healthiest-yet" target="_window">Johnson &amp; Johnson&rsquo;s GenH Challenge</a>'
resume_link_url: "https://youtu.be/DA7rIcd8XNI"
resume_link_trigger: ucsf
resume_link_target: "_window"
media:
  - ucsf-0.jpg
  - src: https://youtu.be/DA7rIcd8XNI
    caption: "We tested with medical workers in Kenya."
  - src: ucsf-1.jpg
    caption: "This is a poster made to explain how the virtual mentor works for the SL@B judges."
---
```

- [ ] **Step 5: Update `projects/hutton.md`**:

```markdown
---
slug: hutton
title: Hutton 2.0
disciplines: [interactive]
order: 20
no_trigger: true
resume_section: thoughtworks-sej
resume_order: 3
resume_entry_title: "Hutton 2.0, digital storytelling and political education"
resume_role: "Organizer, Mentor"
resume_description: "Mentored and taught youth game development, design, storytelling, and political education."
resume_link_url: "../media/hutton-1.png"
resume_link_trigger: hutton
media:
  - hutton-1.png
  - hutton-2.jpg
  - hutton-3.jpg
---
```

- [ ] **Step 6: Update `projects/youareatourist.md`**:

```markdown
---
slug: youareatourist
title: "You Are a Tourist"
disciplines: [production]
order: 11
resume_section: production-design-freelance
resume_order: 1
resume_entry_title: "“You are a tourist”"
resume_client: "Death Cab For Cutie"
resume_description: "Production designer for the world's first live broadcast, scripted, multi-camera, one-take music video shoot. Nominated for Best Art Direction at 2011 MTV Video Music Awards."
resume_link_url: "https://youtu.be/qkk5wViJo-I"
resume_link_trigger: youareatourist
media:
  - youareatourist-0.jpg
  - https://youtu.be/qkk5wViJo-I
  - youareatourist-1.jpg
  - youareatourist-2.jpg
  - youareatourist-3.jpg
  - youareatourist-4.jpg
  - youareatourist-5.jpg
  - youareatourist-6.jpg
  - youareatourist-7.jpg
  - youareatourist-8.jpg
  - youareatourist-9.jpg
  - youareatourist-10.jpg
  - youareatourist-11.jpg
  - youareatourist-12.jpg
---
```

- [ ] **Step 7: Update `projects/adidasallin.md`**:

```markdown
---
slug: adidasallin
title: Adidas All In
disciplines: [production]
order: 12
resume_section: production-design-freelance
resume_order: 2
resume_entry_title: "“Adidas all in”"
resume_subtitle: "(Los Angeles)"
resume_client: "Adidas"
resume_description: "Production designer for Los Angeles locations for Adidas International ad campaign, the largest in the brand's history."
resume_link_url: "https://youtu.be/DCRihtIZZdM"
resume_link_trigger: adidasallin
media:
  - adidasallin-0.jpg
  - https://youtu.be/DCRihtIZZdM
  - adidasallin-1.jpg
  - adidasallin-2.jpg
  - adidasallin-3.jpg
  - adidasallin-4.jpg
  - adidasallin-5.jpg
  - adidasallin-6.jpg
  - adidasallin-7.jpg
  - adidasallin-8.jpg
  - adidasallin-9.jpg
  - adidasallin-10.jpg
---
```

- [ ] **Step 8: Update `projects/bornfree.md`**:

```markdown
---
slug: bornfree
title: Born Free
disciplines: [production]
order: 13
resume_section: production-design-freelance
resume_order: 3
resume_entry_title: "“Born free”"
resume_client: "M.I.A."
resume_description: "Production designer for short film/ music video nominated for \"Best Dance Video\" at the 2010 UK Music Video Awards and ranked by NME as thirteenth on a list of the 100 Greatest Music Videos Ever Made."
resume_link_url: "https://vimeo.com/11219730"
resume_link_trigger: bornfree
media:
  - bornfree-0.jpg
  - https://vimeo.com/11219730
  - bornfree-1.jpg
  - bornfree-2.jpg
  - bornfree-3.jpg
  - bornfree-4.jpg
  - bornfree-5.jpg
  - bornfree-6.jpg
---
```

- [ ] **Step 9: Update `projects/thenaturebetweenus.md`**:

```markdown
---
slug: thenaturebetweenus
title: The Nature Between Us
disciplines: [production]
order: 17
resume_section: production-design-freelance
resume_order: 4
resume_entry_title: "“The nature between Us”"
resume_client: "William Campbell"
resume_description: "Production designer for short film selected for SXSW 2009."
resume_link_url: "https://vimeo.com/3371232"
resume_link_trigger: thenaturebetweenus
media:
  - thenaturebetweenus-0.jpg
  - https://vimeo.com/3371232
  - thenaturebetweenus-1.jpg
  - thenaturebetweenus-2.jpg
  - thenaturebetweenus-3.jpg
  - thenaturebetweenus-4.jpg
  - thenaturebetweenus-5.jpg
  - thenaturebetweenus-6.jpg
  - thenaturebetweenus-7.jpg
  - thenaturebetweenus-8.jpg
---
```

- [ ] **Step 10: Update `projects/theexecutionofsolomonharris.md`**:

```markdown
---
slug: theexecutionofsolomonharris
title: The Execution of Solomon Harris
disciplines: [production]
order: 18
resume_section: production-design-freelance
resume_order: 5
resume_entry_title: "“The execution of Solomon Harris”"
resume_client: "Wyatt Garfield + Ed Yonitis"
resume_description: "Production designer for short film selected for SXSW 2008."
resume_link_url: "http://vimeo.com/20337358"
resume_link_trigger: theexecutionofsolomonharris
media:
  - theexecutionofsolomonharris-0.jpg
  - http://vimeo.com/20337358
  - theexecutionofsolomonharris-1.jpg
  - theexecutionofsolomonharris-2.jpg
  - theexecutionofsolomonharris-3.jpg
  - theexecutionofsolomonharris-4.jpg
---
```

- [ ] **Step 11: Commit**

```bash
git add projects/qcon.md projects/qbo.md projects/nmfg.md projects/ucsf.md projects/hutton.md projects/youareatourist.md projects/adidasallin.md projects/bornfree.md projects/thenaturebetweenus.md projects/theexecutionofsolomonharris.md
git commit -m "feat: add resume fields to 10 existing project files"
```

---

### Task 4: Update `build-portfolio.js` to skip `portfolio: false` projects

**Files:**
- Modify: `scripts/build-portfolio.js`
- Modify: `scripts/test-build-portfolio.js`

- [ ] **Step 1: Write the failing test**

In `scripts/test-build-portfolio.js`, add at the end (before any final `console.log`):

```js
// portfolio: false filtering
{
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-test-'))
  fs.writeFileSync(path.join(tmpDir, 'visible.md'), `---\nslug: visible\ntitle: Visible\ndisciplines: [product]\norder: 1\nmedia:\n  - img.jpg\n---\n`)
  fs.writeFileSync(path.join(tmpDir, 'hidden.md'), `---\nslug: hidden\ntitle: Hidden\nportfolio: false\ndisciplines: [product]\norder: 2\nmedia:\n  - img.jpg\n---\n`)
  const html = generatePortfolioHTML(tmpDir)
  assert(!html.includes('id="hidden"'), 'portfolio: false item must not appear in portfolio HTML')
  assert(html.includes('id="visible"'), 'portfolio: true item must appear in portfolio HTML')
  fs.rmSync(tmpDir, { recursive: true })
}
```

Also add `import os from 'os'` at the top if it is not already imported.

- [ ] **Step 2: Run test to verify it fails**

```bash
node scripts/test-build-portfolio.js
```

Expected: Assertion error about `id="hidden"` appearing in output.

- [ ] **Step 3: Update `generatePortfolioHTML` in `scripts/build-portfolio.js`**

Change:

```js
export function generatePortfolioHTML(dir) {
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8')
      return matter(raw).data
    })
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

  return files.map(renderProject).join('\n')
}
```

To:

```js
export function generatePortfolioHTML(dir) {
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf8')
      return matter(raw).data
    })
    .filter(d => d.portfolio !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

  return files.map(renderProject).join('\n')
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
node scripts/test-build-portfolio.js
```

Expected: exits 0 with no assertion errors.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-portfolio.js scripts/test-build-portfolio.js
git commit -m "feat: skip portfolio:false projects in portfolio generator"
```

---

### Task 5: Create `scripts/build-resume.js` and `scripts/test-build-resume.js`

**Files:**
- Create: `scripts/build-resume.js`
- Create: `scripts/test-build-resume.js`

- [ ] **Step 1: Write the failing tests** — create `scripts/test-build-resume.js`:

```js
import assert from 'assert'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateResumeHTML } from './build-resume.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const employersPath = path.resolve(__dirname, '../resume-data/employers.md')
const projectsDir = path.resolve(__dirname, '../projects')

const html = generateResumeHTML(employersPath, projectsDir)

// Employer sections exist in correct order
const indices = ['pariveda', 'checkr', 'thoughtworks', 'playsets', 'discovery', 'eyeboogie', 'production-design'].map(id => {
  const marker = `data-disciplines=`
  // Check by employer name presence
})
assert(html.includes('class="resume-employer"'), 'resume-employer sections must exist')
assert((html.match(/class="resume-employer"/g) || []).length === 7, 'must have exactly 7 employer sections')

// data-disciplines attributes
assert(html.includes('data-disciplines="product"'), 'product discipline section must exist')
assert(html.includes('data-disciplines="interactive product"'), 'ThoughtWorks must have interactive+product disciplines')
assert(html.includes('data-disciplines="production"'), 'production discipline section must exist')

// Employer names present
assert(html.includes('>Pariveda<'), 'Pariveda must appear')
assert(html.includes('>Checkr<'), 'Checkr must appear')
assert(html.includes('>ThoughtWorks<'), 'ThoughtWorks must appear')
assert(html.includes('The Playsets Team'), 'Playsets must appear')
assert(html.includes('Discovery Communications'), 'Discovery must appear')
assert(html.includes('Eyeboogie Inc'), 'Eyeboogie must appear')
assert(html.includes('Production Design'), 'Production Design must appear')

// Playsets has data-trigger on h2
assert(html.includes('data-trigger="playsets"'), 'Playsets h2 must have data-trigger')

// Notable projects appear under correct employers
assert(html.includes('Checkr Direct'), 'Checkr Direct must appear')
assert(html.includes('Self-Service Program'), 'Self-Service Program must appear')
assert(html.includes('Segmentation and Enterprise'), 'Segmentation and Enterprise must appear')
assert(html.includes('Expungements'), 'Expungements must appear')
assert(html.includes('Federated Identity and SSO'), 'Federated Identity and SSO must appear')
assert(html.includes('Fairness Framework'), 'Fairness Framework must appear')
assert(html.includes('C4 Media, Conference feedback platform'), 'QCon entry must appear')
assert(html.includes('Tchibo, Connected coffee machine'), 'Qbo entry must appear')
assert(html.includes('GAP Inc, Validated learning process'), 'GAP entry must appear')
assert(html.includes('Natural Markets Food Group'), 'NMFG entry must appear')
assert(html.includes('UCSF Virtual Mentor'), 'UCSF entry must appear')
assert(html.includes('Response Innovation Lab'), 'Response Innovation Lab must appear')
assert(html.includes('Hutton 2.0'), 'Hutton entry must appear')

// Production design entries use <em> for client, not – role
assert(html.includes('<em>Death Cab For Cutie</em>'), 'youareatourist must use em for client')
assert(html.includes('<em>M.I.A.</em>'), 'bornfree must use em for client')
assert(!html.includes('Death Cab For Cutie</h5>'), 'client must not appear raw in h5')

// Adidasallin has subtitle
assert(html.includes('(Los Angeles)'), 'adidasallin subtitle must appear')
assert(html.includes('<em>Adidas</em>'), 'adidasallin client must be in em tag')

// data-trigger attributes on linked projects
assert(html.includes('data-trigger="qcon"'), 'qcon must have data-trigger')
assert(html.includes('data-trigger="ucsf"'), 'ucsf must have data-trigger')
assert(html.includes('data-trigger="hutton"'), 'hutton must have data-trigger')

// Iframe type for Response Innovation Lab
assert(html.includes('data-type="iframe"'), 'Response Innovation Lab must use iframe type')
assert(!html.includes('href="https://responseinnovationlab'), 'iframe link must not have direct href')

// Bullets render as <ul><li>
assert(html.includes('<ul>'), 'bullets must render as ul')
assert(html.includes('Winner of a Schmidt Futures grant'), 'expungements bullets must appear')
assert(html.includes('Saving Lives at Birth Seed Grant'), 'ucsf bullet link text must appear')

// Notable Projects header appears before projects
const checkrIdx = html.indexOf('class="resume-employer"')
const notableIdx = html.indexOf('<h4>Notable Projects</h4>', checkrIdx)
assert(notableIdx !== -1, 'Notable Projects header must appear')

// Link title on qcon
assert(html.includes('title="Qcon case study"'), 'qcon link must have title attribute')

// Employer order: Pariveda before Checkr before ThoughtWorks
const parivIdx = html.indexOf('>Pariveda<')
const checkIdx = html.indexOf('>Checkr<')
const twIdx = html.indexOf('>ThoughtWorks<')
const plIdx = html.indexOf('The Playsets Team')
const discIdx = html.indexOf('Discovery Communications')
const eyeIdx = html.indexOf('Eyeboogie Inc')
const prodIdx = html.indexOf('Production Design')
assert(parivIdx < checkIdx, 'Pariveda must come before Checkr')
assert(checkIdx < twIdx, 'Checkr must come before ThoughtWorks')
assert(twIdx < plIdx, 'ThoughtWorks must come before Playsets')
assert(plIdx < discIdx, 'Playsets must come before Discovery')
assert(discIdx < eyeIdx, 'Discovery must come before Eyeboogie')
assert(eyeIdx < prodIdx, 'Eyeboogie must come before Production Design')

// resume_description is HTML-encoded
assert(!html.includes('& Johnson'), 'raw ampersand must not appear in output')

// portfolio: false projects do NOT affect portfolio (not tested here — see test-build-portfolio.js)

console.log('All resume tests passed')
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node scripts/test-build-resume.js
```

Expected: Error — `build-resume.js` does not exist.

- [ ] **Step 3: Write `scripts/build-resume.js`**

```js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const employersPath = path.resolve(__dirname, '../resume-data/employers.md')
const projectsDir = path.resolve(__dirname, '../projects')
const indexPath = path.resolve(__dirname, '../index.html')

const RESUME_START = '<!-- RESUME_GENERATED_START -->'
const RESUME_END = '<!-- RESUME_GENERATED_END -->'

function htmlEncode(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function buildProjectMap(dir) {
  const map = {}
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))
  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8')
    const data = matter(raw).data
    if (data.resume_section) {
      if (!map[data.resume_section]) map[data.resume_section] = []
      map[data.resume_section].push(data)
    }
  }
  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => (a.resume_order ?? 999) - (b.resume_order ?? 999))
  }
  return map
}

function renderProjectEntry(p) {
  const title = htmlEncode(p.resume_entry_title || p.title || '')

  let linkOpen = ''
  let linkClose = ''
  if (p.resume_link_url) {
    if (p.resume_link_type === 'iframe') {
      let attrs = `href="javascript:;" data-type="iframe" data-src="${htmlEncode(p.resume_link_url)}"`
      if (p.resume_link_target) attrs += ` target="${htmlEncode(p.resume_link_target)}"`
      linkOpen = `<a ${attrs}>`
    } else {
      let attrs = `href="${htmlEncode(p.resume_link_url)}"`
      if (p.resume_link_trigger) attrs += ` data-trigger="${htmlEncode(p.resume_link_trigger)}"`
      if (p.resume_link_target) attrs += ` target="${htmlEncode(p.resume_link_target)}"`
      if (p.resume_link_title) attrs += ` title="${htmlEncode(p.resume_link_title)}"`
      linkOpen = `<a ${attrs}>`
    }
    linkClose = `</a>`
  }

  let separator = ''
  if (p.resume_role) {
    separator = ` – ${htmlEncode(p.resume_role)}`
  } else if (p.resume_client) {
    const sub = p.resume_subtitle ? ` ${htmlEncode(p.resume_subtitle)}` : ''
    separator = `${sub} <em>${htmlEncode(p.resume_client)}</em>`
  }

  let html = `<h5>${linkOpen}${title}${linkClose}${separator}</h5>\n`

  if (p.resume_description) {
    html += `<p>${htmlEncode(p.resume_description)}</p>\n`
  }

  if (p.resume_bullets && p.resume_bullets.length > 0) {
    html += `<ul>\n`
    for (const b of p.resume_bullets) {
      html += `<li>${b}</li>\n`
    }
    html += `</ul>\n`
  }

  return html
}

function renderEmployer(employer, projectMap) {
  const disciplines = (employer.disciplines || []).join(' ')
  let html = `<section class="resume-employer" data-disciplines="${htmlEncode(disciplines)}">\n`

  if (employer.url) {
    let attrs = `href="${htmlEncode(employer.url)}"`
    if (employer.url_target) attrs += ` target="${htmlEncode(employer.url_target)}"`
    if (employer.h2_trigger) attrs += ` data-trigger="${htmlEncode(employer.h2_trigger)}"`
    html += `<h2><a ${attrs}>${htmlEncode(employer.name)}</a></h2>\n`
  } else {
    html += `<h2>${htmlEncode(employer.name)}</h2>\n`
  }

  for (const role of (employer.roles || [])) {
    if (role.title && role.dates) {
      html += `<h3>${role.title} <em>${htmlEncode(role.dates)}</em></h3>\n`
    }
    for (const desc of (role.descriptions || [])) {
      html += `<p>${desc}</p>\n`
    }
    const projects = projectMap[role.id] || []
    if (projects.length > 0) {
      html += `<h4>Notable Projects</h4>\n`
      for (const p of projects) {
        html += renderProjectEntry(p)
      }
    }
  }

  html += `</section>\n`
  return html
}

export function generateResumeHTML(empPath, projDir) {
  const raw = fs.readFileSync(empPath, 'utf8')
  const employers = matter(raw).data.employers || []
  const projectMap = buildProjectMap(projDir)
  return employers.map(e => renderEmployer(e, projectMap)).join('\n')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const resumeHTML = generateResumeHTML(employersPath, projectsDir)

  let indexHTML = fs.readFileSync(indexPath, 'utf8')
  const startIdx = indexHTML.indexOf(RESUME_START)
  const endIdx = indexHTML.indexOf(RESUME_END)

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Markers not found in index.html. Add:\n  ${RESUME_START}\n  ${RESUME_END}`)
    process.exit(1)
  }

  const before = indexHTML.slice(0, startIdx + RESUME_START.length)
  const after = indexHTML.slice(endIdx)
  fs.writeFileSync(indexPath, `${before}\n${resumeHTML}${after}`)

  const count = (resumeHTML.match(/class="resume-employer"/g) || []).length
  console.log(`Resume section updated: ${count} employers`)
}
```

Note: `role.title` is output raw (not htmlEncoded) because the YAML for Playsets stores `"Co-Founder &amp; Product Designer"` as a pre-formed HTML fragment. All other role titles are plain ASCII. This is a deliberate choice: role titles are authored HTML fragments.

- [ ] **Step 4: Run test to verify it passes**

```bash
node scripts/test-build-resume.js
```

Expected: `All resume tests passed`

- [ ] **Step 5: Commit**

```bash
git add scripts/build-resume.js scripts/test-build-resume.js
git commit -m "feat: add build-resume.js with tests — generates resume section from project files"
```

---

### Task 6: Replace static resume HTML with markers and wire into prebuild

**Files:**
- Modify: `index.html`
- Modify: `package.json`

- [ ] **Step 1: Replace the static resume content in `index.html`**

Find the block starting with `<h2><a href="https://www.parivedasolutions.com">Pariveda</a></h2>` and ending with (but not including) `<h2>Education</h2>`, and replace it with the two marker comments. The article should look like:

```html
<article id="resume">
<h2>Product Manager, Designer, Maker</h2>
<!-- RESUME_GENERATED_START -->
<!-- RESUME_GENERATED_END -->
<h2>Education</h2>

<h3>Savannah College of Art and Design</h3>

<p>Bachelor of Arts in Film and Television Production</p>

</article>
```

- [ ] **Step 2: Run the build script to populate the resume section**

```bash
node scripts/build-resume.js
```

Expected: `Resume section updated: 7 employers`

- [ ] **Step 3: Verify markers are populated in `index.html`**

```bash
grep -c "resume-employer" index.html
```

Expected: `7`

- [ ] **Step 4: Update `package.json` — add `build-resume` script and wire into `prebuild`**

Change:
```json
"scripts": {
  "dev": "vite",
  "build-portfolio": "node scripts/build-portfolio.js",
  "prebuild": "node scripts/test-build-portfolio.js && node scripts/build-portfolio.js",
  "build": "vite build && cp -r media dist/ && cp favicon.ico dist/ && node scripts/generate-pdf.js",
  "preview": "vite preview"
}
```

To:
```json
"scripts": {
  "dev": "vite",
  "build-portfolio": "node scripts/build-portfolio.js",
  "build-resume": "node scripts/build-resume.js",
  "prebuild": "node scripts/test-build-portfolio.js && node scripts/build-portfolio.js && node scripts/test-build-resume.js && node scripts/build-resume.js",
  "build": "vite build && cp -r media dist/ && cp favicon.ico dist/ && node scripts/generate-pdf.js",
  "preview": "vite preview"
}
```

- [ ] **Step 5: Commit**

```bash
git add index.html package.json
git commit -m "feat: replace static resume HTML with generated markers; wire build-resume into prebuild"
```

---

### Task 7: Update client-side JS — URL keyword parsing, filterPortfolio, filterResume

**Files:**
- Modify: `index.html` (the `<script>` block at the bottom)

- [ ] **Step 1: Replace the entire inline `<script>` block**

Find the script block starting at `<script>` (after the fancybox script tag) and replace with:

```html
<script>
		var KEYWORD_MAP = {
			product: ['product'],
			design: ['production'],
			game: ['game-production'],
			interactive: ['interactive']
		};

		window.onload = function init(){
			$('nav').show();
			$('a.hidden').each(function(){$(this).data('caption', $(this).text());});
			var search = window.location.search;
			if (search) {
				var keywords = search.slice(1).split('+');
				var disciplines = [];
				keywords.forEach(function(k) {
					var mapped = KEYWORD_MAP[k];
					if (mapped) {
						mapped.forEach(function(d) {
							if (disciplines.indexOf(d) === -1) disciplines.push(d);
						});
					}
				});
				if (disciplines.length > 0) {
					navctrl('portfolio');
					filterPortfolio(disciplines);
					filterResume(disciplines);
					return;
				}
			}
			navctrl('home');
		}

		function navctrl(test){
			$('article').hide();
			$('nav a').removeClass('selected');

			switch (test) {
				case 'home':
					$('#home').show();
					$('a.home').addClass('selected');
					break;
				case 'portfolio':
					$('#portfolio').show();
					$('a.portfolio').addClass('selected');
					filterPortfolio('all');
					break;
				case 'resume':
					$('#resume').show();
					$('a.resume').addClass('selected');
					filterResume('all');
					break;
			}
		};

		function filterPortfolio(filter) {
			var isArray = Array.isArray(filter);
			var disciplineArr = isArray ? filter : [filter];
			$('.portfolio-item').each(function() {
				if (filter === 'all') {
					$(this).show();
					return;
				}
				var d = $(this).data('discipline') || '';
				var disciplines = d === '' ? [] : d.split(' ');
				var match = disciplineArr.some(function(df) {
					return disciplines.indexOf(df) !== -1;
				});
				$(this).toggle(match);
			});
			$('.filter-btn').removeClass('selected');
			if (filter === 'all') {
				$('.filter-btn[data-filter="all"]').addClass('selected');
			} else if (!isArray) {
				$('.filter-btn[data-filter="' + filter + '"]').addClass('selected');
			}
		}

		function filterResume(filter) {
			var disciplineArr = (filter === 'all') ? null : (Array.isArray(filter) ? filter : [filter]);
			$('.resume-employer').each(function() {
				if (!disciplineArr) {
					$(this).show();
					return;
				}
				var d = $(this).data('disciplines') || '';
				var disciplines = d === '' ? [] : d.split(' ');
				var match = disciplineArr.some(function(df) {
					return disciplines.indexOf(df) !== -1;
				});
				$(this).toggle(match);
			});
		}
	</script>
```

- [ ] **Step 2: Verify the page loads correctly in dev mode**

```bash
npm run dev
```

Open `http://localhost:5173` — should load to home view.
Open `http://localhost:5173?product` — should load portfolio filtered to Product items.
Open `http://localhost:5173?product+design` — should load portfolio showing Product + Production Design items.
Open `http://localhost:5173?interactive` — should load portfolio filtered to Interactive items.
Click "resume" in nav — should show all resume sections.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: URL keyword filtering (?product+design), filterPortfolio array support, filterResume"
```

---

## Self-Review

**Spec coverage:**
- ✅ Resume generates from same project .md files (Tasks 1-6)
- ✅ URL format `?product+design` (Task 7)
- ✅ All existing resume entries preserved (Tasks 1-3)
- ✅ portfolio: false projects hidden from portfolio grid (Task 4)
- ✅ Resume employer sections filterable by discipline (Tasks 5-7)
- ✅ Build pipeline updated (Task 6)

**Placeholder scan:** No TBD, TODO, or "similar to" references found.

**Type consistency:**
- `generateResumeHTML(empPath, projDir)` — used in test and export
- `buildProjectMap(dir)` — returns `{ [roleId]: projectData[] }`
- `renderEmployer(employer, projectMap)` — matches call in `generateResumeHTML`
- `RESUME_START` / `RESUME_END` — consistent in build script and index.html
- `resume_section` field in projects → maps to `role.id` in employers.md ✅
- `data-disciplines` attribute on sections → read by `filterResume` via `.data('disciplines')` ✅
