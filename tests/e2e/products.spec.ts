import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
    test.beforeEach(async ({ page }) => {
        console.log('Navigating to /products page');
        await page.goto('/products');
    });

    test('should display products page title', async ({ page }) => {
        console.log('Checking if the page title is displayed');
        const titleLocator = page.locator('h2');
        const title = await titleLocator.textContent();
        console.log(`Page title: ${title}`);
        await expect(titleLocator).toHaveText('Products');
    });

    test('should show add product form when clicking add button', async ({ page }) => {
        // Получаем кнопку с помощью getByRole и используем .locator() для дальнейшего взаимодействия
        const addProductButton = page.locator('role=link[name=""]');
        console.log('Clicking the add product button');
        await addProductButton.click();  // Используем метод click() с правильным селектором

        const formLocator = page.locator('form');
        console.log('Checking if the add product form is visible');
        await expect(formLocator).toBeVisible();

        const headingLocator = page.locator('h3');
        const headingText = await headingLocator.textContent();
        console.log(`Form heading: ${headingText}`);
        await expect(headingLocator).toHaveText('Add New Product');
    });


    test('should show product details in correct format', async ({ page }) => {
        const firstProduct = page.locator('tbody tr').first();
        console.log('Checking if the first product has the correct format');

        // Check if product has all required columns
        const columnsCount = await firstProduct.locator('td').count();
        console.log(`Product has ${columnsCount} columns`);
        await expect(firstProduct.locator('td')).toHaveCount(9);
    });
});
