# Real Estate CRM System — Google Sheets

**Industry:** Real Estate  
**Client Type:** Solo Independent Real Estate Agent, NYC  
**Scope:** Buyer, Seller, and Renter pipeline management  
**Timeline:** Built in a single work session  
**Result:** 8 active buyers converted from a pipeline that had previously produced zero results

-----

## The Problem

A solo real estate agent was managing her entire client pipeline on handwritten sign-in sheets. There was no follow-up system, no way to track where each buyer, seller, or renter was in the process, and no visibility into her pipeline at all. She had recently gone independent from a brokerage and needed a system to run her business from day one.

-----

## What I Built

A fully functional AI-assisted CRM system inside Google Sheets — three separate tracker files, each with its own dashboard, built from the ground up with no third-party software or subscriptions required.

-----

## System Components

### 📋 Buyer Tracker

Tracks active buyers from first contact through closing.

- 20 columns including pipeline status, pre-approval amount, purchase intent, property of interest, special requirements, offer amount, and move-in date
- 38 buyers loaded from handwritten open house sign-in sheets across 4 properties
- Automated follow-up overdue alert (highlights gold when 7+ days since last contact)

### 🏡 Seller Tracker

Tracks seller listings from agreement through closing.

- 21 columns including listing price, property value, days on market (auto-calculates daily), exclusive right to sell agreement, offer tracking, and commission rate
- Days on Market updates automatically every day without any manual input

### 🏢 Renter Tracker

Tracks rental clients from first contact through lease signing and placement.

- 27 columns including monthly budget, credit score range, voucher/Section 8 status, current lease end date, desired move-in date, unit shown, application status, exclusive rights, lease signed, and placement date
- Rental-specific amenities list for special requirements

-----

## Features (All Three Trackers)

|Feature                          |Description                                                                                                                                                           |
|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Color-coded dropdowns            |Every status, priority, and yes/no field is color coded. Green = active/yes, Red = cold/no, Yellow = warm/in progress, Blue = under contract/listed                   |
|Priority column                  |High / Medium / Low with red / yellow / green coding                                                                                                                  |
|Follow-up overdue alert          |Last Contact Date column turns gold automatically when a buyer/seller/renter hasn’t been contacted in 7+ days                                                         |
|Follow-Up Count                  |Manual tally column to track total number of outreach attempts                                                                                                        |
|Live dashboard                   |Stat cards showing total clients, pipeline breakdown by status, and live follow-up due count                                                                          |
|Search                           |Type a name on the dashboard, run Search from the menu — matching rows highlight in bold with a blue border. Go to Next Match cycles through multiple results         |
|Sort                             |One-click sort A-Z by name or by oldest Last Contact Date                                                                                                             |
|Calendar date picker             |Click any date column, open Date Picker menu — a calendar sidebar opens to select the date                                                                            |
|Auto hyperlinks                  |Phone numbers auto-link as tap-to-call (tel:). Emails auto-link as tap-to-email (mailto:). Addresses auto-link to Google Maps. All activate the moment text is entered|
|Dynamic alternating rows         |Blue/white row pattern stays correct no matter how many times the sheet is sorted                                                                                     |
|Hidden Lists tab                 |Dropdown options stored in a hidden tab so they never need to be retyped if the file is rebuilt                                                                       |
|Special Requirements multi-select|Chip-style multi-select dropdown for amenities. Buyer sheet has 18 NYC buyer-specific options. Renter sheet has 18 rental-specific options                            |

-----

## Tools Used

- Google Sheets (data, formatting, conditional formatting, data validation)
- Google Apps Script (JavaScript — custom menus, calendar picker, search, sort, auto-hyperlinks)
- AI-assisted build process (Claude by Anthropic)
- No third-party plugins, no subscriptions, no external databases

-----

## File Structure

```
/buyer-tracker
  Buyer_Tracker_FINAL.xlsx      — Spreadsheet with all 38 buyers loaded
  Buyer_Script_FINAL.gs         — Google Apps Script (install via Extensions → Apps Script)
  Buyer_Tracker_Spec.docx       — Full technical specification and AI rebuild prompt

/seller-tracker
  Seller_Tracker_FINAL.xlsx     — Blank seller tracker ready for data entry
  Seller_Script_FINAL.gs        — Google Apps Script
  Seller_Tracker_Spec.docx      — Full technical specification and AI rebuild prompt

/renter-tracker
  Renter_Tracker_FINAL.xlsx     — Blank renter tracker ready for data entry
  Renter_Script_FINAL.gs        — Google Apps Script
  Renter_Tracker_Spec.docx      — Full technical specification and AI rebuild prompt
```

-----

## How to Rebuild This Project

There are two ways to recreate any of these trackers from scratch:

### Option A — Use the AI Rebuild Prompt

Each tracker has a `.docx` specification file in its folder. Section 9 of each spec contains a ready-to-use prompt. Copy and paste it into Claude (claude.ai) and it will generate both the `.xlsx` file and the `.gs` script automatically.

**Buyer Tracker prompt** — found in `Buyer_Tracker_Spec.docx`, Section 9  
**Seller Tracker prompt** — found in `Seller_Tracker_Spec.docx`, Section 9  
**Renter Tracker prompt** — found in `Renter_Tracker_Spec.docx`, Section 9

### Option B — Hand to a Developer

The `.docx` spec files are written as complete technical blueprints. A developer has everything needed to build any tracker from scratch without any additional instruction.

-----

## How to Install After Rebuilding

1. Download the `.xlsx` file
1. Upload to Google Drive → right-click → Open with Google Sheets
1. Go to **File → Save as Google Sheets** to convert it
1. Go to **Format → Alternating Colors** to set up dynamic row colors
1. Go to **Data → Data Validation** on the Special Requirements column → check **Allow Multiple Selections**
1. Go to **Extensions → Apps Script** → delete existing code → paste the `.gs` script → Save → Run → approve permissions → refresh the sheet
1. Confirm three menus appear at the top: **📅 Date Picker**, **🔍 Search**, **🔃 Sort**

-----

## The Result

Eight active buyers converted from a list that had previously produced zero results. The agent now has a complete client management system across all three sides of her business — buyers, sellers, and renters — at zero ongoing cost, replacing software that would typically run $50–$100 per month.

-----

## Note on Privacy

All client data is confidential and has been removed from the files in this repository. The buyer tracker uploaded here contains the original data structure and formatting only. This repository documents the system architecture, features, methodology, and rebuild instructions for the engagement.

-----

## About This Build

This project was built by Cherelle Townes of [The Townes Office](https://github.com/yourusername) — an AI-Powered Business Operations Consultant specializing in building custom back-end systems for small businesses and independent professionals using AI-assisted tools.
