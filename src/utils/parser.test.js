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

const keyring_branch = `
[[package]]
name = "keyring"
version = "23.5.0"
description = "Store and access your passwords safely."
category = "main"
optional = false
python-versions = ">=3.7"

[package.dependencies]
importlib-metadata = ">=3.6"
jeepney = {version = ">=0.4.2", markers = "sys_platform == \"linux\""}
pywin32-ctypes = {version = "<0.1.0 || >0.1.0,<0.1.1 || >0.1.1", markers = "sys_platform == \"win32\""}
SecretStorage = {version = ">=3.2", markers = "sys_platform == \"linux\""}

[package.extras]
docs = ["sphinx", "jaraco.packaging (>=8.2)", "rst.linker (>=1.9)", "jaraco.tidelift (>=1.4)"]
testing = ["pytest (>=6)", "pytest-checkdocs (>=2.4)", "pytest-flake8", "pytest-cov", "pytest-enabler (>=1.0.1)", "pytest-black (>=0.3.7)", "pytest-mypy"]

[[package]]
name = "secretstorage"
version = "3.3.2"
description = "Python bindings to FreeDesktop.org Secret Service API"
category = "main"
optional = false
python-versions = ">=3.6"

[package.dependencies]
cryptography = ">=2.0"
jeepney = ">=0.6"

[metadata]

`

test('keyring brach, secretstorage is saved only once', () => {
  const packages = parseTOML(keyring_branch)
  const names = Object.keys(packages)
  expect(names).toContain('secretstorage')
  expect(names).not.toContain('SecretStorage')
})
