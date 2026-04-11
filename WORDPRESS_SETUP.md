# WordPress Setup Guide — Vitamin C Headless CMS

## Prerequisites
- WordPress installed on Hostinger (hPanel → WordPress → Install)
- WordPress Admin Dashboard access

---

## Step 1: Install Required Plugins

WordPress Admin → Plugins → Add New → Install & Activate each:

| Plugin | Search For | Notes |
|--------|-----------|-------|
| **WPGraphQL** | "WPGraphQL" | by WPGraphQL | Free |
| **WPGraphQL for ACF** | "WPGraphQL for ACF" | by WPGraphQL | Free |
| **ACF PRO** | Upload ZIP | Purchase from advancedcustomfields.com |
| **Custom Post Type UI** | "Custom Post Type UI" | by WebDevStudios | Free |

---

## Step 2: Register Custom Post Types

### ✅ Option A — PHP File Upload (RECOMMENDED — No CPT UI plugin needed!)

**Ek file upload karo, teeno CPTs auto-register ho jayenge:**

1. `acf-import/vitaminc-cpts.php` file copy karo
2. Hostinger File Manager ya FTP se upload karo:
   ```
   wp-content/mu-plugins/vitaminc-cpts.php
   ```
3. Done! Plugin page pe jaane ki zaroorat nahi — **mu-plugins auto-activate hote hain**

> **mu-plugins** = "Must Use Plugins" — WordPress automatically inhe load karta hai bina activation ke.

---

### Option B — CPT UI JSON Import (Agar CPT UI already install hai)

**WordPress Admin → CPT UI → Tools → Import Post Types**

1. `acf-import/cpt-ui-import.json` ka content copy karo
2. Import text area mein paste karo
3. **Import** button click karo

---

### Verify karo — WordPress Dashboard mein ye teen menus dikhne chahiye:

| Menu Item | Icon | CPT Slug |
|-----------|------|---------|
| **Serums** | 📊 Activity | `serum` |
| **Ingredients** | 🧪 Test Tube | `ingredient` |
| **Brands** | 🏷️ Tag | `brand` |

---

## Step 3: Import ACF Field Groups (One Click!)

### ✅ No Manual Creation Needed — JSON Import Use Karo!

Project mein `acf-import/` folder mein teeno ready-made JSON files hain:

```
acf-import/
├── serum-data.json       ← Serum ke saare fields (20+ fields!)
├── ingredient-data.json  ← Ingredient science fields
└── brand-data.json       ← Brand website + logo
```

### Import Steps:

**WordPress Admin → Custom Fields → Tools → Import Field Groups**

1. Click **"Choose File"**
2. `acf-import/serum-data.json` select karo → **Import**
3. Repeat for `ingredient-data.json`
4. Repeat for `brand-data.json`

Done! ✅ Teeno field groups automatically create ho jayenge with correct names, types, and GraphQL settings.

---

### Verify Import Karo:

**Custom Fields → Field Groups** mein ye teen groups dikhne chahiye:

| Field Group | Location | GraphQL Name |
|-------------|----------|-------------|
| Serum Data | Post Type: serum | `serumData` |
| Ingredient Data | Post Type: ingredient | `ingredientData` |
| Brand Data | Post Type: brand | `brandData` |

---

## Step 4: Enable WPGraphQL for ACF

ACF → Field Groups → Edit each field group:
- Scroll down to **GraphQL** section
- Toggle "Show in GraphQL" = **ON**
- GraphQL Field Name will auto-populate (edit if needed to match exactly)

---

## Step 5: Configure WPGraphQL Settings

WPGraphQL → Settings:
- **GraphQL Endpoint**: `/graphql` (default) ← use this in .env
- **Enable Public Introspection**: ✅ ON (for development)
- **Enable Batch Queries**: ✅ ON

---

## Step 6: Update Next.js .env

```env
WP_GRAPHQL_URL="https://yourdomain.hostinger.com/graphql"
WP_URL="https://yourdomain.hostinger.com"
```

---

## Step 7: Run Data Migration

### 7a. Create WordPress Application Password
WordPress Admin → Users → Edit your profile → Application Passwords
- Name: "Vitamin C Migration"
- Click "Add New Application Password"
- Copy the generated password (format: `xxxx xxxx xxxx xxxx xxxx xxxx`)

### 7b. Run Migration Script
```bash
# Add to .env temporarily:
WP_MIGRATE_USER=admin
WP_MIGRATE_PASS=xxxx xxxx xxxx xxxx xxxx xxxx

# Run:
npm run migrate-to-wp
```

---

## Step 8: Verify on WordPress Dashboard

1. WordPress Admin → Serums → All Serums — verify all 15 serums
2. WordPress Admin → Ingredients — verify all ingredients
3. WordPress Admin → Brands — verify all brands
4. Go to: `https://yourdomain.hostinger.com/graphql`
   - Run a test query in the GraphiQL IDE

**Test Query:**
```graphql
{
  serums(first: 3) {
    nodes {
      title
      slug
      serumData {
        price
        vitaminCType
        rank
      }
    }
  }
}
```

---

## Step 9: Test Next.js Frontend

```bash
npm run dev
# Open http://localhost:3000
# Test: /serums, /serums/[slug], /ingredients
```

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| GraphQL returns empty | Check CPT "Show in GraphQL" = ON |
| ACF fields not in GraphQL | Check ACF field group "Show in GraphQL" = ON |
| 401 Unauthorized | Check WP Application Password, REST API enabled |
| Images not loading | Add Hostinger domain to next.config.ts |
| Serum not found by slug | Verify slug matches between WP and frontend |
