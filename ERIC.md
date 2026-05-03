GLOBAL ITEMS

# free shipping
- Do you really want free shipping?
- Biggest disadvntage is that we can no longer retain (keep) the shipping costs when customers ask for their money back.
Adding Post & Packaging gives us the option to advertise a lower headline price?

- You decide.

- What about money back guarantee less post & packaging costs.

# what about when we do no  have stock
- should we cahnge ships in 72 hours while stocks last
- then we informa them that they go on a wiating list

# subscription
- we do not have an email subscription CTA
- free extract from The Thin Book Of FAT when you subsscribe to news of upcoming products in the Tracker Series
- must have spam email subscription filter
--

## https://shop.meterbolic.com/

# change graphics
The bubble with the meter in it looks like old science fiction design.
Saad or Erik try to make it look better.

#issue
    '⚡ Only 14 kits left at this price',
    '🔥 23 people viewing this right now',

- If these numbers are no realistic, then they make us look not credible. So they shoudl be dynamic to look real or we drop this.

- It is a good idea but the implementation must be realistic or even real.

# The pattern behind the number 
- that is for the Kraft Test - has nthing to do with the Lipid Meter Product.
- We add this stuff later

# Built by the people who live this
- arrows for horiz scrolll noop!
--

## https://shop.meterbolic.com/checkout

# bundle
6 months of Meo AI
Lipid meter — bundled
20 lipid test strips + lancets + carry case
Biological Age Score included

- Add to bundle -- also see below in the new format
 - Metabolic Data Visualisation Dashboard
 - Reports and Guidance to improve your vitality and scores on the dashboard

- Do we want price post & packaging on /checkout?
 - why not just at the Stripe add it there?
  -less customer bounce?

#########################################################################################################33
# Eric's Comments & Instructions

This file is Eric's editorial layer. Drop comments, copy changes, design instructions, and ideas here. Nothing in this file touches the live code directly — hand it to Saad or Claude to action. Each entry has a section reference, a type tag, and the instruction body.

**Type tags:**
- `#comment` — observation or note, no action needed yet
- `#instruct` — change to be made to the code or copy
- `#idea` — future consideration, not urgent
- `#done` — actioned, kept for record

---

## Hero Section

<!-- add your entries below this line -->


---

## Problem / Agitation Section

<!-- add your entries below this line -->


---

## How It Works / System Section

<!-- add your entries below this line -->


---

## Lipid Tracking Section

<!-- add your entries below this line -->


---

## Meo AI Section

<!-- add your entries below this line -->


---

## Biological Age Score Section

<!-- add your entries below this line -->


---

## eBook Section

<!-- add your entries below this line -->


---

## Offer Stack / Pricing Section

<!-- add your entries below this line -->

- Offer stack needs to include 
  - the GRAFANA visuals of the BAS here: https://docs.google.com/document/d/1cMlgAol22NjUshEfE5yy5dv0GECEC2aKBFhHKOhXMgo/edit?tab=t.hw2do2j0hzay#bookmark=kix.e7x3k98frkfx
     - ALL of them
  - The Digital Pack
     - Let LLM make a summary of what is in the Digital Pack: https://docs.google.com/document/d/1NZijPx_HXyhvCWLUo0m87eEGniGaRbjife3Qe_U_GhY/edit?tab=t.7j5qsw4o4b2p#bookmark=id.okna3z860ncv
     - this has a lot of value
  - The Dashboard with data visualisation and your data analysis (yes it in Grafana Form and in MeO form -- ok but its a dashboard)
  - You Metabolic Health scores in illustrated PDF Report

---

## Testimonials / Social Proof

<!-- add your entries below this line -->
none


---

## Team / Partners Section

<!-- add your entries below this line -->

        
---

## Checkout Page

<!-- add your entries below this line -->


---

## General / Cross-Cutting

<!-- add your entries below this line -->
# instruct
- Eric to dear Saad
  ```I can be around this afternoon for instant checking``` -- interact with you.

 - Not just this ERIC.md specifications, but we also need these:
  - Gauges: https://docs.google.com/document/d/1NZijPx_HXyhvCWLUo0m87eEGniGaRbjife3Qe_U_GhY/edit?tab=t.obr245uer2x#bookmark=id.53ppolf4afag
  - Six Markers text: https://docs.google.com/document/d/1cMlgAol22NjUshEfE5yy5dv0GECEC2aKBFhHKOhXMgo/edit?tab=t.s2lvv8okfzd#bookmark=id.vb4n4ck2e0ja
  - !Therapist placeholder with Spen! : https://docs.google.com/document/d/1cMlgAol22NjUshEfE5yy5dv0GECEC2aKBFhHKOhXMgo/edit?tab=t.s2lvv8okfzd#bookmark=id.550r9iuexejn
  - !BAS Logo! : https://docs.google.com/document/d/1cMlgAol22NjUshEfE5yy5dv0GECEC2aKBFhHKOhXMgo/edit?tab=t.s2lvv8okfzd#bookmark=id.a5z8fwlp12d4

# comment
- These items we can do Later
   - the integration of `meterbolic.com` and `app.`
   - adding Pixel (referensed this already in /diff/site project
   - words from Meterbolic -- collected sayings or aphorisms from Eric to be dynamically displayed

# instruct
In the terms/page.tsx, you write:
              These terms govern your purchase and use of the Meo Metabolic
              Health Cholesterol Tracker (&ldquo;Meo&rdquo;), sold by Meterbolic
              Ltd, England &amp; Wales. By placing an order you agree to be
              bound by these terms. They are governed by the laws of England
              &amp; Wales.
            </p>
- The existing DIFFERENCECODe/aite website
 - Has terms and conditions
 - Privacy ...
- This needs to be integrated with what you have above.

# instruct
```function UrgencyBadge() {
  const msgs = [
    '⚡ Only 14 kits left at this price',
    '🔥 23 people viewing this right now',
    '📦 Ships in 72 hrs — order before5PM',
  ];
```
- the first two make no sense as constants. Looks entirely wrongwhen it is constant for the UX

---

## Meo Combined — Integration Notes

Notes specific to how this landing page should behave inside meocombined.

<!-- add your entries below this line -->

- We should see the Landing Pages embedded inside the website. So that it is in the context of the website.
- We should have access to the enclist mode of the MeO.
  - enlist mode is when they sign up to the mailinglist, then they are on the ENLIST Tier

- We have documented this previously:
