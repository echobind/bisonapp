# Contributing to Bison

We would love for you to contribute to Bison and help make it even better than it is today!

## Getting Started

### Found a Bug?

If you find a bug, you can help us by [submitting an issue](#submitting-an-issue) to our GitHub Repository. Even better, you can submit a [pull request](#submitting-a-pull-request) with a fix.

### Development Workflow

Refer to our individual package contributing guides for information about the developer workflow to contribute changes:

- [create-bison-app](packages/create-bison-app/CONTRIBUTING.md)

## Submitting an Issue

Before you submit an issue, please search the [issue tracker](https://github.com/echobind/bisonapp/issues), maybe an issue for your problem already exists.

When reporting bugs, please provide minimal reproduction steps and information about your development environment so maintainers can quickly replicate and fix the bug.

When requesting features or enhancements, please provide your use-case so we can understand what you're trying to achieve.

## Submitting a Pull Request

Please provide all information in our pull request template when submitting a PR:
- Description of the issue being fixed
- Description of changes being made in the PR
- Screenshots, preferably animated gif if making UI changes
- Checklist
  -  Does this update a dependency?
  -  Verify that generating a new app works
- Issue number

## Commit Message Format

We use conventional commit messages:

```
<type>(<scope>): <short summary>
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

### Type

Must be one of the following:

* **build**: Changes that affect the build system or external dependencies
* **chore**: Changes that don't modify src or test files
* **ci**: Changes to our CI configuration files and scripts
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **test**: Adding missing tests or correcting existing tests
