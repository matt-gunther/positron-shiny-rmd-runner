# positron-shiny-rmd-runner

A minimal [Positron](https://positron.posit.co/) extension that runs Shiny
apps and Shiny R Markdown documents in your active **R console session**
instead of a terminal process.

## Why

Positron's built-in Shiny extension launches apps via a terminal, which
means your R environment, loaded packages, and in-memory objects are not
available to the app. This extension sends the run command directly to an
active R console session instead.

## Keybindings

| Shortcut | When | What it does |
|---|---|---|
| `Ctrl+Shift+Enter` (`Cmd+Shift+Enter` on Mac) | Active file is R, workspace root contains `app.R` or `ui.R` + `server.R` | Runs `shiny::runApp()` in the R console |
| `Ctrl+Shift+K` (`Cmd+Shift+K` on Mac) | Active file is an Rmd with `runtime: shiny` in the YAML header | Runs `rmarkdown::run()` on the active file in the R console |

Outside these conditions the keybindings are inactive, so normal
`Ctrl+Shift+Enter` behavior is preserved in non-Shiny projects.

## Requirements

- [Positron](https://positron.posit.co/) (desktop or Workbench)
- An active R console session in Positron
- R packages: `shiny`, `rmarkdown`, `rstudioapi`

## Installation

No packaging tools are needed. Clone the repo directly into Positron's
extensions directory and reload.

**Posit Workbench:**

```bash
git clone https://github.com/matt-gunther/positron-shiny-rmd-runner.git \
  ~/.positron-server/extensions/shiny-console-runner
```

**Positron desktop (Mac/Linux):**

```bash
git clone https://github.com/matt-gunther/positron-shiny-rmd-runner.git \
  ~/.positron/extensions/shiny-console-runner
```

Then reload Positron: `Ctrl+Shift+P` → **Developer: Reload Window**.

> **Note:** If you have the `posit.shiny` extension installed, it registers
> its own `Ctrl+Shift+Enter` binding and may take precedence. Disable or
> uninstall it from the Extensions panel if the keybinding doesn't fire.

## Known limitations

- **Shiny app path:** `shiny::runApp()` is called with no path argument, so
  it uses the R session's working directory (`getwd()`). This works correctly
  when the R session is rooted at the project folder, which is the default
  in Positron. If your working directory differs, the app may not be found.

- **Shiny Rmd path:** `rmarkdown::run()` is called with just the filename
  (no directory). It will only work if the R session's working directory is
  the same folder as the Rmd file.

- **Rmd language ID:** The `Ctrl+Shift+K` binding activates when Positron
  treats the file as `quarto` language. This is the default when you add
  the following to Positron's `settings.json`:

  ```json
  "files.associations": {
    "*.Rmd": "quarto",
    "*.rmd": "quarto"
  }
  ```

  Without this setting, the binding will not fire for `.Rmd` files.
