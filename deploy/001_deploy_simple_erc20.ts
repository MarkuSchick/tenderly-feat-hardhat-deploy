import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('ERC20', {
    from: deployer,
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const token = await hre.ethers.getContract('ERC20');

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
