import { Selector } from "testcafe"

fixture`Frontend-Backend Integration`.page`http://localhost:3003`

test("Client fetches and displays skills from backend API", async (t) => {
   // Wait for the skills section to appear (adjust selector as needed)
   const skillsSection = Selector('[data-testid="skills-section"]')
   await t.expect(skillsSection.exists).ok("Skills section should exist")

   // Check that at least one skill is rendered (adjust selector as needed)
   const skillItem = Selector('[data-testid="skill-item"]')
   await t.expect(skillItem.count).gt(0, "At least one skill should be rendered")
})
