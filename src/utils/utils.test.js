import '@testing-library/jest-dom'
import parseTOML from './parser'

const mock_file = `
[[package]]
name = "cffi"
version = "1.15.0"
description = "Foreign Function Interface for Python calling C code."
category = "main"
optional = false
python-versions = "*"

[package.dependencies]
pycparser = "*"

[[package]]
name = "pycparser"
version = "2.21"
description = "C parser in Python"
category = "main"
optional = false
python-versions = ">=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*"

[metadata]

`

test('installed packages are saved', () => {
  const packages = parseTOML(mock_file)
  const names = Object.keys(packages)
  expect(names).toHaveLength(2)
  expect(names).toContain('cffi')
  expect(names).toContain('pycparser')
})

test('installed package saves dependecies', () => {
  const packages = parseTOML(mock_file)
  const pckg = packages['cffi']
  expect(pckg.dependencies).toHaveLength(1)
  expect(pckg.dependencies).toContainEqual({
    name: 'pycparser',
    optional: false,
  })
})

test('installed package saves also installed reverse dependencies', () => {
  const packages = parseTOML(mock_file)
  expect(packages['pycparser'].reverseDependencies).toHaveLength(1)
  expect(packages['pycparser'].reverseDependencies).toContain('cffi')
})

const mypy_branch = `
[[package]]
name = "mypy"
version = "0.950"
description = "Optional static typing for Python"
category = "dev"
optional = false
python-versions = ">=3.6"

[package.dependencies]
mypy-extensions = ">=0.4.3"
tomli = {version = ">=1.1.0", markers = "python_version < \"3.11\""}
typed-ast = {version = ">=1.4.0,<2", markers = "python_version < \"3.8\""}
typing-extensions = ">=3.10"

[package.extras]
dmypy = ["psutil (>=4.0)"]
python2 = ["typed-ast (>=1.4.0,<2)"]
reports = ["lxml"]

[[package]]
name = "typed-ast"
version = "1.5.3"
description = "a fork of Python 2 and 3 ast modules with type comment support"
category = "dev"
optional = false
python-versions = ">=3.6"

[metadata]

`

test('mypy brach, all packages are saved', () => {
  const packages = parseTOML(mypy_branch)
  const names = Object.keys(packages)
  expect(names).toHaveLength(7)
})

test('mypy branch, typed-ast has mypy as a reverse dependency', () => {
  const packages = parseTOML(mypy_branch)
  const pckg = packages['typed-ast']
  expect(pckg.reverseDependencies).toHaveLength(1)
  expect(pckg.reverseDependencies).toContain('mypy')
})
