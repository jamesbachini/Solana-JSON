apt upgrade
apt update
apt install nodejs
apt install npm
apt install python3-pip
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
sh -c "$(curl -sSfL https://release.solana.com/v1.5.7/install)"
source $HOME/.cargo/env
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"
export RUST_LOG=solana_runtime::system_instruction_processor=trace,solana_runtime::message_processor=debug,solana_bpf_loader=debug,solana_rbpf=debug
solana-test-validator --log