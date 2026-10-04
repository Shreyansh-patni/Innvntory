# 001 - PALETTE SELECTION

**Context:** The project required explicit definitions for the core Light Mode and Dark Mode application palettes to form the foundation of the Innvntory UI. Aoutive provided the overall marketing visual direction, but specific SaaS UI token references were needed.

**Options:** 
1. Derive arbitrary scales using an online generator.
2. Rely entirely on default Tailwind/shadcn colors.
3. Accept the explicit Light/Dark palette source files provided by the product owner.

**Chosen:** Option 3. We accepted the `Light Mode.md` and `Dark Mode.md` source palettes explicitly supplied by the product owner.

**Why:** The user provided these explicit references. By rule, user instructions and product owner references supersede defaults or guessed values. The palettes offer a sophisticated neutral scale tailored for the product's precise, professional, and slightly restrained visual identity.

**Tradeoffs:** Manually mapping a custom scale takes slightly more initial effort than adopting standard Tailwind scales (e.g., `slate` or `zinc`). The exact semantic mapping for components (e.g., specific border colors vs. subtle backgrounds) is still partly TBD until implementation begins.

**Consequences:** 
- The UI implementation will map its CSS variables directly to these source hex values.
- The marketing canvas background (`#f7f7f7`, derived from Aoutive) is kept distinct from the strict Product UI backgrounds (`#FFFFFF` in Light Mode, `#111213` in Dark Mode) unless further unified.
- The project now has a definitive answer for its neutral token progression in both modes.

**Status:** Resolved (Source Values). (Component-specific semantic mappings remain partly TBD).
