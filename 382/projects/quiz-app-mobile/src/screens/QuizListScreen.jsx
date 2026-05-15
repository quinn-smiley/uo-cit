/**
 * React Native version of Quiz List.
 * Props: quizzes, onTakeQuiz(id), onEditQuiz(id), onDeleteQuiz(id)
 */
import { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  Modal,
} from 'react-native'
import { colors } from '../theme/colors'
import { useResponsive } from '../theme/layout'

export default function QuizListScreen({
  quizzes,
  onTakeQuiz,
  onEditQuiz,
  onDeleteQuiz,
}) {
  const [menuQuizId, setMenuQuizId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null) // { id, title } | null
  const { columns, width, isLargeUp } = useResponsive()
  const gap = 16
  const horizontalPadding = isLargeUp ? 8 : 16

  // Same card width math as in renderCard, so we can center the grid
  const innerWidth = width - horizontalPadding * 2
  const baseWidth =
    columns > 1
      ? (innerWidth - gap * (columns - 1)) / columns
      : innerWidth
  const cardWidth = isLargeUp ? baseWidth * 0.6 : baseWidth * 0.9
  const rowWidth = columns * cardWidth + (columns - 1) * gap
  const centerPadding = Math.max(0, (innerWidth - rowWidth) / 2)

  const requestDelete = (id, title) => {
    setMenuQuizId(null)
    setConfirmDelete({ id, title })
  }

  const confirmDeleteNow = () => {
    const id = confirmDelete?.id
    setConfirmDelete(null)
    if (id) onDeleteQuiz?.(id)
  }

  const renderCard = ({ item: q }) => {
    const showMenu = menuQuizId === q.id
    const innerWidth = width - horizontalPadding * 2
    const baseWidth =
      columns > 1
        ? (innerWidth - gap * (columns - 1)) / columns
        : innerWidth
    // Desktop: make tiles significantly smaller; Mobile/tablet: modest shrink
    const cardWidth = isLargeUp ? baseWidth * 0.6 : baseWidth * 0.9
    // On desktop (large screens), cards are nearly square; on smaller screens use a
    // 16:9-ish thumbnail and auto height for a standard card layout.
    // Make the image dominate more of the tile height
    const thumbHeight = isLargeUp
      ? Math.max(120, Math.round(cardWidth * 0.5))
      : Math.max(140, Math.round(cardWidth * 0.65))
    return (
      <View
        style={[
          styles.card,
          isLargeUp
            ? {
                width: cardWidth,
                // use a minimum height so content can grow without clipping
                minHeight: Math.round(cardWidth * 0.72),
              }
            : {
                width: cardWidth,
              },
        ]}
      >
        <Pressable
          style={styles.menuButton}
          onPress={() => setMenuQuizId(showMenu ? null : q.id)}
        >
          <Text style={styles.menuButtonText}>⋯</Text>
        </Pressable>

        <View style={[styles.thumb, { height: thumbHeight }]}>
          {q.thumbnail ? (
            <Image
              source={{ uri: q.thumbnail }}
              style={styles.thumbImage}
              resizeMode="cover"
              accessibilityLabel={`${q.title || 'Quiz'} thumbnail`}
            />
          ) : (
            <Text style={styles.thumbPlaceholder}>No image</Text>
          )}
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {q.title}
          </Text>

          <View style={styles.cardTextRow}>
            <Text style={styles.cardMeta}>
              {q.questions.length} question{q.questions.length !== 1 ? 's' : ''}
            </Text>
            <Pressable
              style={styles.takeButton}
              onPress={() => onTakeQuiz?.(q.id)}
            >
              <Text style={styles.takeButtonText}>Take Quiz</Text>
            </Pressable>
          </View>
        </View>

        <Modal
          visible={showMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuQuizId(null)}
        >
          <View style={styles.menuBackdrop}>
            <Pressable
              style={styles.backdropPressable}
              onPress={() => setMenuQuizId(null)}
            />
            <View style={styles.menuBox}>
              {onEditQuiz && (
                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuQuizId(null)
                    onEditQuiz(q.id)
                  }}
                >
                  <Text style={styles.menuItemText}>Edit</Text>
                </Pressable>
              )}
              {onDeleteQuiz && (
                <Pressable
                  style={[styles.menuItem, styles.menuItemDanger]}
                  onPress={() => requestDelete(q.id, q.title)}
                >
                  <Text style={styles.menuItemTextDanger}>Delete</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingHorizontal: horizontalPadding + centerPadding }]}>
        <Text style={styles.title}>Available Quizzes</Text>
        <Text style={styles.muted}>
          {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''}
        </Text>
      </View>

      {quizzes.length === 0 ? (
        <View style={[styles.empty, { paddingHorizontal: horizontalPadding + centerPadding }]}>
          <Text style={styles.emptyText}>No quizzes yet. Create one!</Text>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(q) => q.id}
          key={String(columns)}
          numColumns={columns}
          renderItem={renderCard}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingHorizontal: horizontalPadding + centerPadding,
            },
          ]}
          columnWrapperStyle={columns > 1 ? { gap } : undefined}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={!!confirmDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDelete(null)}
      >
        <View style={styles.menuBackdrop}>
          <Pressable
            style={styles.backdropPressable}
            onPress={() => setConfirmDelete(null)}
          />
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Delete Quiz</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to delete &quot;{confirmDelete?.title}&quot;?
              This action cannot be undone.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                style={[styles.confirmBtn, styles.confirmBtnSecondary]}
                onPress={() => setConfirmDelete(null)}
              >
                <Text style={styles.confirmBtnSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, styles.confirmBtnDanger]}
                onPress={confirmDeleteNow}
              >
                <Text style={styles.confirmBtnDangerText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
    backgroundColor: colors.bg,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
    color: colors.text,
    },
    muted: {
      fontSize: 14,
    color: colors.muted,
      marginTop: 4,
    },
    empty: {
      padding: 32,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
    color: colors.muted,
    },
    listContent: {
      padding: 16,
      paddingTop: 8,
    gap: 16,
    },
    card: {
    backgroundColor: colors.panel,
      borderRadius: 12,
      borderWidth: 1,
    borderColor: colors.border,
      marginBottom: 16,
      overflow: 'hidden',
    },
    menuButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 36,
      height: 36,
      borderRadius: 18,
    backgroundColor: colors.panel,
      borderWidth: 1,
    borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    menuButtonText: {
      fontSize: 20,
    color: colors.text,
      lineHeight: 22,
    },
    thumb: {
    backgroundColor: colors.elev,
      alignItems: 'center',
      justifyContent: 'center',
    },
    thumbImage: {
      width: '100%',
      height: '100%',
    },
    thumbPlaceholder: {
      fontSize: 14,
    color: colors.muted,
    },
    cardBody: {
      padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    color: colors.text,
      marginBottom: 4,
    },
    cardMeta: {
      fontSize: 14,
    color: colors.muted,
      marginBottom: 12,
    },
    takeButton: {
    backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    takeButtonText: {
    color: colors.bg,
      fontSize: 16,
      fontWeight: '600',
    },
    menuBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
    menuBox: {
    backgroundColor: colors.panel,
      borderRadius: 12,
      minWidth: 160,
      overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    },
    menuItem: {
      paddingVertical: 14,
      paddingHorizontal: 20,
    },
    menuItemDanger: {
      borderTopWidth: 1,
    borderTopColor: colors.border,
    },
    menuItemText: {
      fontSize: 16,
    color: colors.text,
    },
    menuItemTextDanger: {
      fontSize: 16,
    color: colors.danger,
    },

  confirmBox: {
    backgroundColor: colors.panel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    width: '90%',
    maxWidth: 420,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  confirmBtnSecondary: {
    backgroundColor: colors.elev,
    borderColor: colors.border,
  },
  confirmBtnDanger: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  confirmBtnSecondaryText: {
    color: colors.text,
    fontWeight: '600',
  },
  confirmBtnDangerText: {
    color: colors.bg,
    fontWeight: '700',
  },
})
