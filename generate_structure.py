import os

def generate_project_structure_readme(root_dir="."):
    """
    Dynamically reads the folder and file structure of the current directory
    and writes it to a README.md file in a tree-like format.

    Args:
        root_dir (str): The root directory to scan. Defaults to the current directory.
    """

    readme_file_name = "README.md"
    script_file_name = os.path.basename(__file__) # Get the name of the current script file
    readme_file_path = os.path.join(root_dir, readme_file_name)

    # Directories to exclude from the generated structure
    excluded_dirs = ['node_modules', '.angular', '.git', 'public'] # Added 'public' to the exclusion list

    print(f"Scanning directory: {os.path.abspath(root_dir)}")
    print(f"Generating project structure description in: {os.path.abspath(readme_file_path)}")

    def build_tree_string(current_path, indent_level=0):
        """Recursively builds a string representation of the directory tree."""
        tree_str = ""
        # Use a consistent indent for visual clarity
        indent_prefix = "│   " * indent_level
        items = sorted(os.listdir(current_path)) # Sort items for consistent output

        # Filter out excluded items before iterating to correctly determine last item
        filtered_items = [
            item for item in items
            if item != readme_file_name and item != script_file_name and item not in excluded_dirs
        ]

        for i, item_name in enumerate(filtered_items):
            item_path = os.path.join(current_path, item_name)

            # Determine if it's the last item in the current filtered directory level
            connector = "└── " if i == len(filtered_items) - 1 else "├── "

            if os.path.isdir(item_path):
                tree_str += f"{indent_prefix}{connector}{item_name}/\n"
                # For subdirectories, adjust the indent prefix for children
                next_indent_prefix = indent_prefix + ("    " if i == len(filtered_items) - 1 else "│   ")
                tree_str += build_tree_string(item_path, indent_level + 1)
            else:
                tree_str += f"{indent_prefix}{connector}{item_name}\n"
        return tree_str

    # Build the tree string starting from the root_dir
    project_root_name = os.path.basename(os.path.abspath(root_dir))
    tree_output = f"{project_root_name}/\n"
    tree_output += build_tree_string(root_dir, indent_level=0)

    # Prepare the content for the README.md file
    readme_content = f"""# Project Structure

This file dynamically outlines the folder and file structure of the current directory.

```
{tree_output}
```

## How to use this script

1.  **Save the script:** Save this code as a Python file (e.g., `generate_structure.py`).
2.  **Place it:** Put this script in the root directory of the project you want to document.
3.  **Run the script:** Open your terminal or command prompt, navigate to that directory, and run:
    ```bash
    python generate_structure.py
    ```
    A `README.md` file will be created/updated in the same directory, containing the project's structure.
"""

    # Write the structure to README.md
    with open(readme_file_path, "w", encoding="utf-8") as f:
        f.write(readme_content)

    print(f"\nProject structure description saved to '{readme_file_path}'!")
    print(f"To view the structure, open the '{readme_file_path}' file.")

if __name__ == "__main__":
    generate_project_structure_readme()
