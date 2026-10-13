# VERITY / STORY — The Unfinished Friend

> **It knew everything. Except how to let go.**

A cinematic, **mobile-first independent lore investigation** into ThatMob's scripted Minecraft horror trilogy **VERITY™**. This is a fan-made editorial case archive, not an official production or a playable Minecraft mod.

**Planned public address:** https://cachenetworks.github.io/VerityStory/  
**Original film:** https://www.youtube.com/watch?v=f6f3PhauXyg

## What is included

- Responsive, self-contained landing page featuring an original CSS-drawn Verity-inspired orb
- Eight major research sections and seven chapters of long-form interpretation
- Film chronology and in-universe timeline (with separately labelled uncertain historical claims)
- Episode gallery linking **directly** to ThatMob's original YouTube videos
- Eight evidence dossiers marked as source observations vs interpretation
- Nine filterable theory files graded by source support
- AGI / ASI / artificial consciousness discussion that distinguishes fiction from reality
- Credit roster and primary/secondary/community source register
- Keyboard-accessible search with Ctrl+K / Cmd+K, mobile menu, functional tabs and filters
- Reduced-motion support, semantic HTML, responsive breakpoints, high-contrast focus outlines
- Automatic GitHub Pages publishing workflow

### The editorial rule

We use three distinct evidence tiers:

1. **Film / reported:** Events presented in ThatMob's source trilogy (or attributed episode summaries).
2. **Inference:** Interpretations that plausibly follow from events but are *not* definitive canon.
3. **Theory:** Fan hypotheses, crossovers and speculation with explicitly variable support.

The original three episodes **precede** community-made playable mods and Roblox experiences. Features added in an adaptation do not automatically establish the original film's canon.

## Local development

No build pipeline, API keys, database, Node dependencies or account credentials are required.

Open \`index.html\` in a browser, or use a simple local HTTP server:

\`\`\`sh
python3 -m http.server 8000
# visit http://localhost:8000/
\`\`\`

Files:

\`\`\`text
index.html       Main page and lore chapters
styles.css       All styling, illustration and responsive design
app.js           Search, tabs, filters, menu, keyboard interactions
favicon.svg      Original icon
social-preview.svg  Original sharable graphic
.github/workflows/deploy.yml  GitHub Pages deployment
\`\`\`

Google Fonts are optional network resources; local system fonts are provided as fallbacks. Video thumbnails load from YouTube. No site analytics, trackers or third-party scripts are loaded.

## Publish to GitHub Pages

The \`main\` branch contains a GitHub Actions workflow that deploys this static site.

GitHub Pages must be enabled once under **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow can then be run from **Actions → Publish VerityStory to GitHub Pages → Run workflow**, or triggered by a new commit to \`main\`.

Expected project URL: **https://cachenetworks.github.io/VerityStory/**

If you want a root-style \`veritystory.github.io\` address, that requires a separate GitHub account or organisation named \`veritystory\` and the corresponding Pages repository, or a custom domain. It does **not** automatically follow the project repository name.

## Sources & credits

**Original series and character:** ThatMob.  
**Verity voice (as credited in published film coverage):** JustWhispy.  
**Featured creators:** Twixxel and Grox.  
**Fan-site research layout, website and commentary:** CacheNetworks.

Primary original videos:

- [Something is Knocking at Your Door...](https://www.youtube.com/watch?v=hGBROjRqyDM)
- [Something is Inside Your House...](https://www.youtube.com/watch?v=PtZVmOWw1Xs)
- [Something Won't Let You Leave...](https://www.youtube.com/watch?v=8utcF9Azbxo)
- [VERITY™ full Minecraft movie](https://www.youtube.com/watch?v=f6f3PhauXyg)

Additional review and community discussions:

- [Original Verity series — companion wiki](https://verity-companion.robloxgamewiki.com/lore/verity-series-explained/)
- [ThatMob publication overview](https://verityminecraft.com/thatmob/)
- [Full movie release and creator credits](https://verity.wiki/guides/thatmob-full-movie/)
- [Fan decoding of SENDHIMHOME](https://www.reddit.com/r/MinecraftARGs/comments/1u4er2p/i_found_something_in_verity_part_2/)
- [Fan theory: countdown and disobedience](https://www.reddit.com/r/MinecraftARGs/comments/1v62bgr/a_theory_on_thatmobs_verity_arg/)
- [Critical discussion of narrative consistency](https://www.reddit.com/r/MinecraftARGs/comments/1vamu9e/verity_is_the_worst_piece_of_minecraft_horror_i/)

The site includes detailed, clickable attribution. No film audio or video is downloaded or hosted by this repository. External YouTube thumbnails remain the property of their respective rights holders.

## Legal and content note

This is an **unofficial, independent fan website** with no affiliation with ThatMob, Mojang, Minecraft, Microsoft, Google or any mod developers. **VERITY™**, its original character designs, dialogue and film material remain the property of their owners. The original website code, design and written analysis are distinct from the underlying film and character IP.

This repository does not currently grant a software reuse license. Public visibility of source code alone is not a redistribution licence; contact the relevant rights holder before reusing protected creative material.

The story contains horror and a fictional death by suicide. The archive discusses these themes critically, not as an endorsement or romanticisation.

For factual corrections, please [open an issue](https://github.com/cachenetworks/VerityStory/issues) linking the original episode or source.

**Last editorial review: 14 October 2026.**
