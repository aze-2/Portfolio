"use client"

import {
  Box,
  Flex,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
  Link as ChakraLink,
  Link,
} from "@chakra-ui/react"
import {
  InfoIcon,
  HamburgerIcon,
  UnlockIcon,
} from "@chakra-ui/icons"
import NextLink from "next/link"
import { useAuth } from "@/app/supabase-AuthProvider"
import useStore from "../../../../store"

export default function NavigationBar() {
    const { user } = useAuth();
    const { profile } = useStore();
    
//   const [user, setUser] = useState<UserType>({
//     isLoggedIn: false,
//     name: "ユーザー",
//     image: "/placeholder.svg",
//   })

//   const toggleLogin = () => {
//     setUser((prev) => ({
//       ...prev,
//       isLoggedIn: !prev.isLoggedIn,
//     }))
//   }

  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure()
  const { isOpen: isInfoOpen, onOpen: onInfoOpen, onClose: onInfoClose } = useDisclosure()

  return (
    <Box position="sticky" top={0} zIndex={50} bg="white" borderBottom="1px solid #e2e8f0" px={4}>
      <Flex h="4rem" align="center" justify="space-between" maxW="container.lg" mx="auto">
        {/* 左側: ロゴ */}
        <HStack spacing={3}>
        <ChakraLink as={NextLink} href="/" display="flex" alignItems="center">
            {/* <Box boxSize="2rem" bg="black" display="flex" justifyContent="center" alignItems="center">
                <img
                src="/placeholder.svg"
                alt="logo"
                height={24}
                width={24}
                style={{ filter: "invert(1)" }}
                />
            </Box> */}
            <Text fontWeight="bold" fontSize="xl" ml={2} display={{ base: "none", sm: "inline-block" }}>
                Home Aound Notes
            </Text>
        </ChakraLink>
        </HStack>

        {/* 中央: 検索バー（md以上で表示）
        <Box flex={1} mx={4} display={{ base: "none", md: "block" }} maxW="400px">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input placeholder="写真とイラストを検索" rounded="full" bg="gray.100" />
          </InputGroup>
        </Box> */}

        {/* 右側: メニュー */}
        <HStack spacing={2}>
          {/* ログイン／プロフィール */}
          {user ? (
            <Menu>
              <MenuButton as={IconButton} icon={<Avatar size="sm" name={profile.name ?? ''} src={profile.avatar_url!} />} variant="ghost" />
              <MenuList>
              <MenuItem as={NextLink} href="/user/profile"/* icon={<UserIcon />}*/>
  プロフィール
</MenuItem>
                <MenuDivider />
                <MenuItem icon={<UnlockIcon />}/* onClick={toggleLogin}*/>
                  ログアウト
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button colorScheme='#e2e8f0' as={NextLink} href="/login" variant='outline' size='xs'>
            ログイン
            </Button>
          )}

          {/* 情報ボタン */}
          <IconButton
            icon={<InfoIcon />}
            aria-label="Info"
            variant="ghost"
            onClick={onInfoOpen}
          />

          <IconButton
            icon={<HamburgerIcon />}
            aria-label="Menu"
            variant="ghost"
            display={{ base: "inline-flex"/*, md: "none" */}}
            onClick={onMenuOpen}
          />
        </HStack>
      </Flex>

      {/* 情報ドロワー */}
      <Drawer isOpen={isInfoOpen} placement="right" onClose={onInfoClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>ページ情報</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4} mt={2}>
              <Text>地域SNSです。</Text>
              <Text mb={10}>身近にある素敵な場所を記録・共有してください。</Text>
              <Text color='red.500'>なお、現在の内容はすべてフェイクですので、事実とは異なります</Text>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* メニュードロワー */}
      <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>メニュー</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4} mt={2}>
              {/* <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input placeholder="写真とイラストを検索" rounded="full" bg="gray.100" />
              </InputGroup>
 */}
              <Link as={NextLink} href='/'>ホーム</Link>
              <Link as={NextLink} href="/map">GoogleMap検索</Link>
              <Link as={NextLink} href="/user">マイページ</Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
