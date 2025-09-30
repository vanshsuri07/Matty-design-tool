from playwright.sync_api import sync_playwright, Page, expect
import time

def verify_canvas_tools(page: Page):
    """
    This script verifies that the canvas tools are working correctly.
    It registers a new user, navigates to the editor, and tests the copy, paste,
    pen, and frame tools.
    """
    # 1. Arrange: Go to the registration page.
    page.goto("http://localhost:3000/register")

    # 2. Act: Register a new user.
    unique_email = f"testuser_{int(time.time())}@example.com"
    page.get_by_placeholder("Full Name").fill("Test User")
    page.get_by_placeholder("Email address").fill(unique_email)
    page.locator("#password").fill("password123")
    page.locator("#confirmPassword").fill("password123")
    page.get_by_role("button", name="Create Account").click()

    # 3. Assert: Wait for navigation to the dashboard.
    expect(page).to_have_url("http://localhost:3000/dashboard", timeout=10000)

    # 4. Act: Navigate to the editor.
    # Check if there's a "New Design" button to click, otherwise go directly.
    new_design_button = page.get_by_role("button", name="New Design")
    if new_design_button.is_visible():
        new_design_button.click()
    else:
        page.goto("http://localhost:3000/editor")

    # 5. Assert: Wait for the editor to load by checking for the canvas.
    expect(page.locator("canvas")).to_be_visible()

    # 6. Act: Test the canvas tools.
    # Add a rectangle
    page.locator('[data-testid="toolbar-button-shapes"]').click()
    page.locator('[data-testid="toolbar-button-rectangle"]').click()

    # Select the rectangle (by clicking on the canvas where it is likely to be)
    canvas = page.locator("canvas").first()
    canvas.click(position={"x": 150, "y": 150})


    # Copy the rectangle
    page.locator('[data-testid="toolbar-button-copy"]').click()

    # Paste the rectangle
    page.locator('[data-testid="toolbar-button-paste"]').click()

    # Use the pen tool
    page.locator('[data-testid="toolbar-button-pen"]').click()
    canvas.hover()
    page.mouse.down()
    page.mouse.move(200, 200)
    page.mouse.up()

    # Use the frame tool
    page.locator('[data-testid="toolbar-button-frame"]').click()

    # 7. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_canvas_tools(page)
        browser.close()

if __name__ == "__main__":
    main()