import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer, simpleERC20Beneficiary} = await getNamedAccounts();

  await deploy('SimpleERC20', {
    from: deployer,
    args: [simpleERC20Beneficiary, parseEther('1000000000')],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const token = await hre.ethers.getContract('SimpleERC20');

  if (hre.network.name == 'tenderly') {
    await hre.tenderly.persistArtifacts({
      name: 'SimpleERC20',
      address: token.address,
    });

    await hre.tenderly.verify({
      name: 'SimpleERC20',
      address: token.address,
    });
  }
};
export default func;
func.tags = ['SimpleERC20'];
