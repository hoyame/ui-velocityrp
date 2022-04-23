#!/bin/bash
# Create pre-commit hook to lint edited gamemode files
echo "#!/bin/bash" > .git/hooks/pre-commit
echo "cd gamemode && yarn lint-staged" >> .git/hooks/pre-commit
echo "cd ../phone/src && yarn lint-staged" >> .git/hooks/pre-commit

chmod +x .git/hooks/pre-commit

echo "Pre-commit hook installed!"