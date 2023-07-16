#
# The content of this file will be filled in with meaningful data when creating an archive using `git archive` or by
# downloading an archive from github, e.g., from github.com/.../archive/develop.zip
#
rev = "979230b14d"  # abbreviated commit hash
commit = "979230b14da5dc1d5a5b2dab53bcf16d55d8894b"  # commit hash
date = "2023-07-14 17:49:56 +0100"  # commit date
author = "Lorenzo Villani <lvillani@develer.com>"
ref_names = "HEAD -> develop"  # incl. current branch
commit_message = """hookutils: qt: look for commercial pyqt to determine layout

Commercial PyQt wheels install with the "_commercial" suffix as their
package name but still make the regular PyQt5/PyQt6 namespace packages
available.

This leads the layout detection logic to assume the old layout because
is_module_satisfies() enters a fallback code path where it looks for the
__version__ attribute inside the namespace package, which doesn't exist.

A possible solution is to look for package names with the "_commercial"
suffix when the standard lookup fails. The _use_new_layout utility
method was introduced to perform such checks and is then used in both
PyQt5 and PyQt6 code paths.
"""
