# Release history

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<details>
  <summary><strong>Guiding Principles</strong></summary>

- Changelogs are for humans, not machines.
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each versions is displayed.
- Mention whether you follow Semantic Versioning.

</details>

<details>
  <summary><strong>Types of changes</strong></summary>

Changelog entries are classified using the following labels _(from [keep-a-changelog](http://keepachangelog.com/)_):

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

</details>


## [3.0.0] - 2018-11-14

### Fixed

- `validate` function now properly accepts `false` as a return value, thanks to [@g-plane](https://github.com/g-plane).

### Added

- Adds support for <kbd>shift+left</kbd> and <kbd>shift+right</kbd> for cut and paste functionality in string prompts.

### Removed

- `hSelect` and `hMultiSelect` (horizontal select and multiselect) have been removed and moved over to the [recipes](recipes) folder. If you need these prompts and want to see how to re-create the functionality, you will find examples in [recipes/examples](recipes/examples).

### Changed

- `ctrl+x` (`toggleCursor`) has been changed to `ctrl+t`
- `ctrl+d` is now mapped to `deleteForward` instead of `cancel`. 
- When using the `Enquirer.prompt()` method, the `answers` object is now on `prompt.answers`.
- `toggleCursor` is now mapped to <kbd>ctrl</kbd>+<kbd>t</kbd> instead of <kbd>ctrl</kbd>+<kbd>x</kbd>
- `cut` is now mapped to <kbd>ctrl</kbd>+<kbd>x</kbd>

## [2.2.0] - 2018-12-16

### Fixed

Numerous bugfixes and optimizations:

- fixes #90, a bug that was preventing non-string values from being defined on `choice.value`
- fixes #91, a bug on boolean prompts where the `value` getter was ignoring falsey user-defined values. Bug was introduced in dda5993.
- the `placeholder` now fully supports Enquirer's semantic styling system. has more consistent behavior when an empty string is passed.
- minor improvements to the scale prompt.

### Added

- Adds a Toggle prompt. Closes #89.
- Adds support for "options.margin", which allows implementors to define the amount of whitespace padding to use around various prompt elements. Margin may be a number indicating the number of spaces to use, a string - spaces or newlines, or an array of numbers or strings. Similar to CSS, the array `[0, 0, 1, 0]` would define margins in the following order: top, right, bottom, left. More specifically, top (newlines), right (spaces), bottom (newlines), and left (spaces of indentation). A few of the higher level prompts, like select, have already added support for margin, but it will need to be added to the others before support is consistent.
- Adds support for `maxSelected` on any array prompt that allows multiple choices to be selected. Closes #92
- Adds a `loading` property to the state to provide an easy way of showing loading indicators or progress bars while choices are loading asynchronously
- Adds support for disabling choices by setting `choice.readonly` to true.
- Adds support for customizing the "drag" symbol   on sort prompts. This symbol is used to indicate that a choice is being sorted.
- Adds a few other useful unicode symbols related to editing and sorting.
- Adds setters to the styles object, to allow styles to be directly updated using `prompt.styles.foo = bar`.
- Also adds a number of unit tests, more docs, and some new examples.

## [2.1.0] - 2018-11-29

### Fixed

- Several improvements were made for handling custom `format`, `result` and `initial` functions defined on the options. 

## [2.0.7] - 2018-11-14

### Fixed

- `validate` function now properly accepts `false` as a return value, thanks to [@g-plane](https://github.com/g-plane).

### Added

- Adds support for <kbd>ctrl</kbd>+<kbd>n</kbd> to add choices
- Adds support for `options.required` on all prompts. Uses the built-in `validate()` function, allowing this functionality to be overridden or customized.
- Adds support for `options.scroll` to disable scrolling in array prompts.
- Adds support for `options.onRun`, which is called when `prompt.run()` is called, after the readline instance is created.
- Adds support for `options.history` on the `Input` and `Text` prompts. 
- Adds support for `options.term` to set the terminal, thanks to [@tunnckoCore](https://github.com/tunnckoCore). At the moment this is only used in a couple of edge cases with the `Survey` and `Scale` prompts to check if the terminal is Hyper.
- `options.skip` may now be a Boolean, thanks to [@tunnckoCore](https://github.com/tunnckoCore)

## [2.0.0] - 2018-11-07

### Changed

Enquire 2.0 is a bottom-up complete re-write:

- Several prompts that were previously published as individual packages will be included in Enquirer itself. 
- Why? - As users, we didn't like having to add commonly-used prompts as plugins. Enquirer 2.0 will still support custom prompts as plugins, but many prompts will also be built-in.
- Enquirer will only have a single dependency, https://github.com/doowb/ansi-colors, which itself has no other dependencies). This will make Enquirer easier to maintain and faster for users.
- Methods for registering "questions" have been removed. While it was nice to be able to preregister questions that could be called upon later, this is something that is better left to implementors, as it's relatively trivial to do with custom code.
- `options.default` is now `options.initial`

### Added

- Many prompts that were previously separate packages are now bundled into Enquirer itself. 

### [0.1.0] - 2016-08-28

First release.


[0.2.0]: https://github.com/jonschlinkert/micromatch/compare/0.1.0...0.2.0
[Unreleased]: https://github.com/enquirer/enquirer/compare/2.0.2...HEAD
[keep-a-changelog]: https://github.com/olivierlacan/keep-a-changelog
